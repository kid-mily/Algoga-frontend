import axios from 'axios';

export const getBannerList = async () => {
  const response = await axios.get('/api/banner');

  return response.data;
};