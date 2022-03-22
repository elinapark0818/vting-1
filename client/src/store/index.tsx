import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";

// 생성할 vote format 관련 state입니다.
export interface VoteItems {
  idx: number;
  content: string;
  count?: number;
}

export interface NewVote {
  format: string;
  title: string;
  type?: string;
  items: VoteItems[];
  multiple?: boolean;
  manytines?: boolean;
}

const initialVoteItemState = {
  idx: 1,
  content: "",
};

const initialVoteState: NewVote = {
  format: "",
  title: "",
  type: "",
  items: [],
  multiple: false,
  manytines: false,
};

const newVoteItemSlice = createSlice({
  name: "newVoteItem",
  initialState: initialVoteItemState,
  reducers: {
    setItem(state, action: PayloadAction<string>) {
      state.content = action.payload;
    },
    setIndex(state, action: PayloadAction<number>) {
      state.idx = action.payload;
    },
  },
});

const newVoteSlice = createSlice({
  name: "newVote",
  initialState: initialVoteState,
  reducers: {
    setFormat(state, action: PayloadAction<string>) {
      state.format = action.payload;
    },
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setType(state, action: PayloadAction<string>) {
      state.type = action.payload;
    },
    setItems(state, action: PayloadAction<VoteItems>) {
      state.items = [...state.items, action.payload];
    },
    setMultiple(state, action: PayloadAction<boolean>) {
      state.multiple = action.payload;
    },
    setManyTimes(state, action: PayloadAction<boolean>) {
      state.manytines = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    makeNewVote: newVoteSlice.reducer,
    makeNewVoteItem: newVoteItemSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export const {
  setFormat,
  setTitle,
  setType,
  setItems,
  setMultiple,
  setManyTimes,
} = newVoteSlice.actions;

export const { setItem, setIndex } = newVoteItemSlice.actions;

export default store;
