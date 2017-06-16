import * as AdminActionTypes from '../actiontypes/admin';
import axios from 'axios';

const url = "https://fathomless-meadow-60353.herokuapp.com";
const blogID = "594314b2e79fd106a010a955";


//=======================================================
export const makeModal = (vis) => {
  return {
    type: AdminActionTypes.MAKE_MODAL,
    vis
  }
}

export const selectEdit = (data) => {
  return {
    type: AdminActionTypes.SELECT_EDIT,
    data
  }
}

export const selectAdd = (data) => {
  return {
    type: AdminActionTypes.SELECT_ADD,
    data
  }
}

export const fail = (results) => {
  return {
    type: AdminActionTypes.FAIL,
    results
  };
};

//===============MESSAGING===============================================
export const sendMessageSuccess = () => {
  return {
    type: AdminActionTypes.SEND_MESSAGE_SUCCESS,

  };
};


export const sendMessage = (data) => {
  return (dispatch) => {
    console.log(data);
    //return dispatch(sendMessageSuccess(data));
    return axios.post(`${url}/user/sayHello`,
      {
        message: `<h3>Hello, from ${data.name}</h3><p><b>Message: </b>${data.message}</p><br /><p><b>Contact: </b>${data.email} ${data.phone}</p>`
      })
      .then(response => {
        console.log("response data", response.data);
        dispatch(sendMessageSuccess());
      })
      .catch(error => {
        console.log(error);
        dispatch(fail({"error": "Message unable to send"}));
        //throw(error);
      });
  }
};



//=====================PAGE LOADING==========================================
export const fetchBlogSuccess = (results) => {
  return {
    type: AdminActionTypes.FETCH_BLOG_SUCCESS,
    results
  };
};


export const fetchBlog = (data) => {
  return (dispatch) => {

    return axios.get(`${url}/page/${blogID}/${data}`)
      .then(response => {
        console.log("response data", response.data);
        dispatch(fetchBlogSuccess(response.data));
      })
      .catch(error => {
        console.log(error);
        alert("Unable to load content at this time.")
      });
  }
};

export const editBlog = (data) => {

  return (dispatch) => {

    return axios.put(`${url}/api/admin/${blogID}/${data.section}/${data.sectionID}`, {
      ...data.input,
      token: data.id
    })
      .then(response => {
        console.log("response data", response.data);
        if(response.data.success === false) dispatch(logout("Session expired. You are now logged out. Log back in again to continue editing."))
        else dispatch(fetchBlogSuccess(response.data));
      })
      .catch(error => {
        console.log(error);
        dispatch(fail({"error": "Unable to edit content at this time."}));
      });
  }
};

export const addBlog = (data) => {
  return (dispatch) => {

    return axios.post(`${url}/api/admin/${blogID}/${data.section}`,
      {
        ...data.input,
        token: data.id
      })
      .then(response => {
        console.log("response data", response.data);
        if(response.data.success === false) dispatch(logout("Session expired. You are now logged out. Log back in again to continue editing."));
        else dispatch(fetchBlogSuccess(response.data));
      })
      .catch(error => {
        console.log(error);
        dispatch(fail({"error": "Unable to add content at this time"}));
      });
  }
};

export const deleteBlog = (data) => {
  return (dispatch) => {

    return axios.delete(`${url}/api/admin/${blogID}/${data.section}/${data.sectionID}?token=${data.id}`)
      .then(response => {
        console.log("response data", response.data);
        if(response.data.success === false) dispatch(logout("Session expired. You are now logged out. Log back in again to continue editing."))
        else dispatch(fetchBlogSuccess(response.data));
      })
      .catch(error => {
        console.log(error);
        dispatch(fail({"error": "Unable to delete content at this time."}));
      });
  }
};


//=================AUTHENTICATION==================================================
export const logout = (message) => {
  if(message === "Session expired. You are now logged out. Log back in again to continue editing.") alert("Session expired");
  return {
    type: AdminActionTypes.LOGOUT,
    message
  };
};

export const verifyEmailSuccess = (results) => {
  return {
    type: AdminActionTypes.VERIFY_EMAIL_SUCCESS,
    results
  };
};

export const verifyEmail = (data) => {
  return (dispatch) => {

    if(data.admin){
      //admin login
      return axios.post(`${url}/api/login`, {
        username: data.username,
        password: data.password
      })
        .then(response => {
          console.log("response data", response.data);
          dispatch(verifyEmailSuccess(response.data));
        })
        .catch(error => {
          console.log(error);
          dispatch(fail({"error": "username and/or password not found"}));
          //throw(error);
        });
    }
    else {
      //user login
      return axios.post(`${url}/locked/userlogin`, {
        username: data.username,
        password: data.password
      })
        .then(response => {
          console.log("response data", response.data);
          dispatch(verifyEmailSuccess(response.data));
        })
        .catch(error => {
          console.log(error);
          dispatch(fail({"error": "username and/or password not found"}));
          //throw(error);
        });
    }
  }
};

//=============GET AVAILABLE ROOMS==============================
// Sync Action
// (4) SUCCESS/UPDATE SEARCHRESULTS PROP
// export const fetchSearchSuccess = (results) => {
//   //console.log("search success");
//   console.log(results);
//   return {
//     type: AdminActionTypes.FETCH_SEARCH_SUCCESS,
//     results
//   }
// };


//(2) GET THE ROOM DATA FROM THE ID
export const filterSearch = (data, results) => {
  //fetch rooms from page
  console.log("FILTER", results);
  return (dispatch) => {
    return axios.get(`${url}/page/${blogID}/rooms`)
      .then(response => {
        console.log("response data", response.data);
        //filter rooms that have too low maximum occupancy
        let availableRooms = [];

        //filter rooms that are not available for each date
        response.data.forEach((o,j) => {
          //with date[0] find the index with the correct roomID
          const i = results[0].map((f, index) => {if(o._id === f.roomID) return index; });
          const index = i[0];
          //for each date at index...
          //determine if reserved < o.available
          let lookup = false;
          if(o.maximumOccupancy >= data.guests) {

            lookup = results.reduce((a,b) => {
              return ((b[index]["reserved"] < o.available) && a);
            }, true);

          }

          if(lookup){
            availableRooms.push(o);
          }
        });
        dispatch(fetchBlogSuccess(availableRooms));

      })
      .catch(error => {
        console.log(error);
        alert("Unable to load content at this time.")
      });
  }
}

//Async Action
//(1) GET ROOMS FROM DB USING DATES
export const fetchSearch = (data) => {

  // Returns a dispatcher function
  // that dispatches an action at a later time
  return (dispatch) => {
    //CREATE AN ARRAY OF DATES OBJECTS
    let end = data.depart - (24*60*60*1000);
    const begin = data.arrive;
    let dateArr = [];
    let results = [];

    while(end >= begin){
      dateArr.push(end);
      end = end - (24*60*60*1000);
    }
    console.log("FETCH", dateArr);

    //USE ARRAY TO CALL AVAILABILITY FOR THAT DAY
    return dateArr.forEach((date) => {
      //returns a promise
      axios.get(`${url}/rooms/${blogID}&${date}`)
      .then(response => {

        results.push(response.data.free);
        //dispatch another action
        //to consume data
        if(results.length === dateArr.length){
          dispatch(filterSearch(data, results));
        }
      })
      .catch((error) => {
        if(error.message.includes("404")){
          axios.post(`${url}/rooms/`,{
            pageID: blogID,
            date: new Date(date)
          })
          .then(res => {

            results.push(res.data.free);
            //dispatch another action
            //to consume data
            if(results.length === dateArr.length){
              dispatch(filterSearch(data, results));
            }
          })
          .catch((error) => {
            console.log(error.message);
            alert("Unable to check availability at this time")
          });
        }
        else {
          alert("Unable to check availability")
        }
      });
    });
  };
};
