import {
  REMOVE_FILE,
  REMOVE_FILE_FAILURE,
  REMOVE_FILE_SUCCESS,
} from '@reducers/actions';
import { FailureResponse, FileInfo } from '@typings/db';

type FileAction =
  | { type: 'REMOVE_FILE' }
  | { type: 'REMOVE_FILE_SUCCESS'; id: number }
  | { type: 'REMOVE_FILE_FAILURE'; error: FailureResponse };

interface FileState {
  isLoading: boolean;
  isError: FailureResponse | null;
  files: FileInfo[];
}

export default function fileReducer(
  state: FileState,
  action: FileAction
): FileState {
  switch (action.type) {
    case REMOVE_FILE:
      return {
        ...state,
        isLoading: true,
        isError: null,
      };
    case REMOVE_FILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        files: state.files.filter(file => file.id !== action.id),
      };
    case REMOVE_FILE_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: action.error,
      };
  }
}
