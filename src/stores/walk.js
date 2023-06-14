import { create } from "zustand";
import { produce } from "immer";

let controller = new AbortController()

const useWalk = create((set, get) => ({
    space: 'z',
    direction: 'Eyeglasses',
    walk: 0,
    walkData: null,
    loading: false,
    error: false,
    errorMessage: '',
    start: 0,
    end: 99,
    setStart: (start) => {
        set(produce(state => {
            state.start = start
        }));
    },
    setEnd: (end) => {
        set(produce(state => {
            state.end = end
        }));
    },
    getWalk: async () => {
        set(produce(state => {
            state.loading = true;
            state.walkData = null;
            state.error = false;
            state.errorMessage = '';
        }));

        try {
            const { space, direction, walk } = get();
            console.log(space, direction, walk);
            const response = await fetch(`/api/walk?space=${space}&direction=${direction}&walk=${walk}`, { signal: controller.signal });

            if (!response.ok) throw new Error("Network response was not ok");

            const walkData = await response.json();

            set(produce(state => {
                state.walkData = walkData;
                state.loading = false;
            }));
        } catch (error) {
            console.error("Fetch failed:", error);
            set(produce(state => {
                state.loading = false;
                state.error = true;
                state.errorMessage = error.message;
            }));
        }
    },
    setSpaceDirectionWalk: (space, direction, walk) => {
        controller.abort();
        controller = new AbortController();

        console.log(space, direction, walk);
        set(produce(state => {
            state.space = space;
            state.direction = direction;
            state.walk = walk;
            state.loading = true;
            state.walks = [];
        }));

        get().getWalk(space, direction, walk);
    }
}));

export default useWalk;

