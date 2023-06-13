import { create } from "zustand";
import { produce } from "immer";

// simple-statistics for linear regression calculation
import * as simpleStatistics from "simple-statistics";

const calculateLinearRegressions = (walk) => {
  console.log('start linear regression');
  walk.attributes.forEach((attribute) => {
    const steps = attribute.steps.map((step) => [
      step.intensity,
      step.score,
    ]);
    const regression = simpleStatistics.linearRegression(steps);
    attribute.slope = regression.m;
    attribute.intercept = regression.b;
    attribute.r2 = simpleStatistics.rSquared(
      steps,
      (x) => regression.m * x + regression.b
    );
  });
  return walk;
};

let controller = new AbortController()

const useStore = create((set, get) => ({
  space: 'z',
  direction: 'Eyeglasses',
  walks: [],
  loading: false,
  error: false,
  errorMessage: '',

  // Function to handle setting loading state
  setLoading: (loading) => {
    set(produce(state => {
      state.loading = loading
    }))
  },

  // Function to handle setting error state
  setError: (error, errorMessage) => {
    set(produce(state => {
      state.error = error
      state.errorMessage = errorMessage
    }))
  },

  getTotalWalks: async (space, direction) => {
    // Abort any ongoing fetch requests
    controller.abort();
    controller = new AbortController();

    try {
      const response = await fetch(
        `/api/totalWalks?space=${space}&direction=${direction}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const { total } = await response.json();
      return total;
    } catch (error) {
      console.error("Fetch failed:", error);
      set(state => produce(state, draftState => {
        draftState.loading = false;
        draftState.error = true;
        draftState.errorMessage = error.message;
      }));
    }
  },

  setSpace: async (space) => {
    const { direction } = get();
    await get().setSpaceAndDirection(space, direction);
  },

  setDirection: async (direction) => {
    const { space } = get();
    await get().setSpaceAndDirection(space, direction);
  },

  // Fetching walks and handling pagination
  setSpaceAndDirection: async (space, direction, limit = 50) => {
    set(state => produce(state, draftState => {
      draftState.loading = true
      draftState.walks = []
      draftState.error = false
      draftState.errorMessage = ''
    }))

    try {
      const totalWalks = await getTotalWalks(space, direction)
      const pages = Math.ceil(totalWalks / limit)

      for (let page = 1; page <= pages; page++) {
        if (get().loading) {
          try {
            const response = await fetch(
              `/api/walks?space=${space}&direction=${direction}&page=${page}&limit=${limit}`,
              { signal: controller.signal }
            )

            if (!response.ok) {
              throw new Error("Network response was not ok")
            }

            const walks = await response.json()

            const updatedWalksPromises = walks.map(async (walk) => {
              return calculateLinearRegressions(walk)
            })

            const updatedWalks = await Promise.all(updatedWalksPromises)

            set(state => produce(state, draftState => {
              draftState.walks.push(...updatedWalks)
            }))

          } catch (error) {
            console.error("Fetch failed:", error)
            set(state => produce(state, draftState => {
              draftState.loading = false
              draftState.error = true
              draftState.errorMessage = error.message
            }))
          }
        }
      }

      set(state => produce(state, draftState => {
        draftState.loading = false
      }))
    } catch (error) {
      console.error("Fetch failed:", error)
      set(state => produce(state, draftState => {
        draftState.loading = false
        draftState.error = true
        draftState.errorMessage = error.message
      }))
    }
  },

  setSpaceAndDirection: (space, direction) => {
    // Abort any ongoing fetch requests
    controller.abort()
    controller = new AbortController()

    set(state => produce(state, draftState => {
      draftState.space = space
      draftState.direction = direction
      draftState.loading = true
      draftState.walks = []
    }))

    get().getWalks(space, direction)
  }
}));

export default useStore;