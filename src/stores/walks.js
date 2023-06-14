import { create } from "zustand";
import { produce } from "immer";
import * as simpleStatistics from "simple-statistics";

const calculateLinearRegressions = (walk) => {
  walk.attributes.forEach((attribute) => {
    const scores = attribute.steps;
    const steps = scores.map((score, index) => [index - 5, score]);
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

const useWalks = create((set, get) => ({
  space: 'z',
  direction: 'Eyeglasses',
  walks: [],
  loading: false,
  error: false,
  errorMessage: '',
  setLoading: (loading) => set(produce(state => { state.loading = loading })),
  setError: (error, errorMessage) => set(produce(state => {
    state.error = error;
    state.errorMessage = errorMessage;
  })),
  setSpace: async (space) => {
    const { direction } = get();
    await get().setSpaceAndDirection(space, direction);
  },
  setDirection: async (direction) => {
    const { space } = get();
    await get().setSpaceAndDirection(space, direction);
  },
  getWalks: async (space, direction, chunks = 10) => {
    set(produce(state => {
      state.loading = true;
      state.walks = [];
      state.error = false;
      state.errorMessage = '';
    }));

    try {
      for (let chunk = 0; chunk < chunks; chunk++) {
        try {
          const response = await fetch(`/api/walks?space=${space}&direction=${direction}&chunk=${chunk}`, { signal: controller.signal });

          if (!response.ok) throw new Error("Network response was not ok");

          const walks = await response.json();
          const updatedWalks = walks.map(calculateLinearRegressions);

          set(state => produce(state, draftState => {
            draftState.walks.push(...updatedWalks);
          }));
        } catch (error) {
          console.error("Fetch failed:", error);
          set(produce(state => {
            state.loading = false;
            state.error = true;
            state.errorMessage = error.message;
          }));
        }
      }
      set(produce(state => { state.loading = false; }));
    } catch (error) {
      console.error("Fetch failed:", error);
      set(produce(state => {
        state.loading = false;
        state.error = true;
        state.errorMessage = error.message;
      }));
    }
  },
  setSpaceAndDirection: (space, direction) => {
    controller.abort();
    controller = new AbortController();

    set(produce(state => {
      state.space = space;
      state.direction = direction;
      state.loading = true;
      state.walks = [];
    }));

    get().getWalks(space, direction);
  }
}));

export default useWalks;
