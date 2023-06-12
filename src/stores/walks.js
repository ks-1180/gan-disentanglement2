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

const useStore = create((set) => ({
  space: 'z',
  direction: 'Eyeglasses',
  walks: [],
  loading: false,

  getWalks: async (space, direction) => {
    set({ loading: true });
    console.log("loading walks...");

    try {
      const response = await fetch(`/api/walks?space=${space}&direction=${direction}`);

      console.log("received response...");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const walks = await response.json();
      console.log("walks", walks);

      walks.forEach(async (walk) => {
        const updatedWalk = calculateLinearRegressions(walk);

        set(state => ({
          ...state,
          walks: [...state.walks, updatedWalk]
        }));
      });

      set({ loading: false });
    } catch (error) {
      console.error("Fetch failed:", error);
      set({ loading: false });
    }
  },
}));

export default useStore;
