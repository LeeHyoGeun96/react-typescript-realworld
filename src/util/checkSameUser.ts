import {CurrentUserType} from '../store/slices/userSlice';
import {Article} from '../types/articleTypes';

interface CheckSameUserParams {
  loggedInUser: CurrentUserType;
  responseUser: Article;
}

export const checkSameUser = ({
  loggedInUser,
  responseUser,
}: CheckSameUserParams) => {
  return loggedInUser.username === responseUser.author.username;
};
