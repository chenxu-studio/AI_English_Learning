import { type Response, serverApi } from "../index";
import type { WordQuery, WordList } from "@en/common/word/index";

export const getWordBookList = async (
  query: WordQuery,
): Promise<Response<WordList>> => {
  return serverApi.get(`/word-book`, {
    params: query,
  }) as Promise<Response<WordList>>;
};
