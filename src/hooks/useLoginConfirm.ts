import {useNavigate} from 'react-router-dom';

export const useLoginConfirm = () => {
  const navigate = useNavigate();

  const confirmLogin = () => {
    if (window.confirm('로그인이 필요합니다 로그인 하시겠습니까?')) {
      navigate('/login');
    }
  };

  return confirmLogin;
};
