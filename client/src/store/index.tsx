import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";

// 로그인, 로그아웃 관련 state입니다.
export interface IsLogin {
  login: boolean;
}

const initialIsLoginState: IsLogin = {
  login: false,
};

const isLogInSlice = createSlice({
  name: "isLogin",
  initialState: initialIsLoginState,
  reducers: {
    setIsLogin(state, action: PayloadAction<boolean>) {
      state.login = action.payload;
    },
  },
});

//  * 회원정보 상태
export interface UserInfo {
  _id?: string;
  nickname?: string;
  email?: string;
  image?: string;
}

const initialUserInfo: UserInfo = {
  _id: "",
  nickname: "",
  email: "",
  image: "",
};

const UserInfoSlice = createSlice({
  name: "userInfo",
  initialState: initialUserInfo,
  reducers: {
    setUserInfo(
      state,
      action: PayloadAction<{
        _id: string;
        nickname?: string;
        email?: string;
        image?: string;
      }>
    ) {
      state._id = action.payload._id || state._id;
      state.nickname = action.payload.nickname || state.nickname;
      state.email = action.payload.email || state.email;
      state.image = action.payload.image || state.image;
    },
  },
});

// Modal 관련 상태
export interface IsModal {
  isOpenModal: boolean;
}

const initialModalState: IsModal = {
  isOpenModal: false,
};

export const isModalSlice = createSlice({
  name: "isOpenModal",
  initialState: initialModalState,
  reducers: {
    setIsModalOpen(state, action: PayloadAction<boolean>) {
      // console.log("바꿈");
      // console.log(action.payload);
      state.isOpenModal = action.payload;
    },
  },
});

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
  manytimes?: boolean;
  password?: string;
}

const initialVoteState: NewVote = {
  format: "",
  title: "",
  type: "",
  items: [],
  multiple: false,
  manytimes: false,
  password: "",
};

const newVoteSlice = createSlice({
  name: "newVote",
  initialState: initialVoteState,
  reducers: {
    setRestart(state, action: PayloadAction<string>) {
      state.format = "";
      state.title = "";
      state.type = "";
      state.items = [];
      state.multiple = false;
      state.manytimes = false;
      state.password = "";
    },
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
      let idx = action.payload.idx;
      if (state.items[idx]) state.items[idx].content = action.payload.content;
      else state.items = [...state.items, action.payload];
    },
    deleteItems(state, action: PayloadAction<number>) {
      state.items = [
        ...state.items.slice(0, action.payload),
        ...state.items.slice(action.payload + 1),
      ];
      for (let i = 0; i < state.items.length; i++) {
        state.items[i].idx = i;
      }
    },
    setMultiple(state, action: PayloadAction<boolean>) {
      state.multiple = action.payload;
    },
    setManyTimes(state, action: PayloadAction<boolean>) {
      state.manytimes = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    isOpenModal: isModalSlice.reducer,
    isLogin: isLogInSlice.reducer,
    makeNewVote: newVoteSlice.reducer,
    userInfo: UserInfoSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export const { setIsLogin } = isLogInSlice.actions;

export const { setUserInfo } = UserInfoSlice.actions;

export const { setIsModalOpen } = isModalSlice.actions;

export const {
  setFormat,
  setTitle,
  setType,
  setItems,
  setMultiple,
  setManyTimes,
  setPassword,
  setRestart,
  deleteItems,
} = newVoteSlice.actions;

export default store;
