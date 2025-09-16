
import AllApi from '../common/commonApi';
import Axios from './Axios'

const FetchUserDetails = async() => {
  try {
    const response = await Axios({
      ...AllApi.userDetails
    })
    return response.data
  } catch (error) {
    console.error(error)
    return null;
  }
};

export default FetchUserDetails;