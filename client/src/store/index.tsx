import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

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

// 받아온 vote (/v 혹은 vote.) 정보 처리를 위한 부분입니다.
export interface ResultVoteItem {
  idx: number;
  content: string;
  count?: number;
}

export interface ResultVoteInfo {
  _id?: string;
  user_id?: string;
  nickname?: string;
  image?: string;
  password?: string;
  url?: number;
  title: string;
  format?: string;
  type?: string;
  items: ResultVoteItem[];
  multiple?: boolean;
  manytimes?: boolean;
  undergoing?: boolean;
  isPublic?: boolean;
  created_at?: string;
  overtime?: number;
  sumCount?: number;
}

const initialGetVoteState: ResultVoteInfo = {
  title: "",
  items: [],
};

const getVoteSlice = createSlice({
  name: "getVote",
  initialState: initialGetVoteState,
  reducers: {
    patchGetVote(state, action: PayloadAction<ResultVoteInfo>) {
      if (action.payload._id) state._id = action.payload._id;
      if (action.payload.user_id) state.user_id = action.payload.user_id;
      if (action.payload.nickname) state.nickname = action.payload.nickname;
      if (action.payload.image) state.image = action.payload.image;
      if (action.payload.password) state.password = action.payload.password;
      if (action.payload.url) state.url = action.payload.url;
      if (action.payload.title) state.title = action.payload.title;
      if (action.payload.format) state.format = action.payload.format;
      if (action.payload.type) state.type = action.payload.type;
      if (action.payload.items) state.items = action.payload.items;
      if (action.payload.multiple) state.multiple = action.payload.multiple;
      if (action.payload.manytimes) state.manytimes = action.payload.manytimes;
      if (action.payload.undergoing)
        state.undergoing = action.payload.undergoing;
      if (action.payload.isPublic) state.isPublic = action.payload.isPublic;
      if (action.payload.created_at)
        state.created_at = action.payload.created_at;
      if (action.payload.overtime) state.overtime = action.payload.overtime;
      if (action.payload.sumCount) state.sumCount = action.payload.sumCount;
    },
  },
});

// 여기서부터 다른 파일에서 import 해오기 위해 사용하는 공용 부분입니다.
const store = configureStore({
  reducer: {
    isOpenModal: isModalSlice.reducer,
    isLogin: isLogInSlice.reducer,
    makeNewVote: newVoteSlice.reducer,
    getVote: getVoteSlice.reducer,
    userInfo: UserInfoSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export const { setIsLogin } = isLogInSlice.actions;

export const { setUserInfo } = UserInfoSlice.actions;

export const { setIsModalOpen } = isModalSlice.actions;

export const { patchGetVote } = getVoteSlice.actions;

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
