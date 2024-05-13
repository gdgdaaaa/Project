// // store/user.js
// import axios from 'axios';
// import router from '@/router';

// const ModuleUser = {
//   namespaced: true,
//   state: {
//     // 现有属性
//     id: "",
//     name: "",
//     completedCourses: [],
//     wishCourses: [],
//     communities: [],
//     recommendedCommunities: [],
//     access: "",
//     refresh: "",
//     is_login: false,
//     is_recommending: false,
//     // 新增属性
//     gender: '',
//     learning_style: '',
//     activity_level: '',
//     self_description: '',
//     communities_count: 0, // 已加入共同体的计数

//   },
//   getters: {
//     // 根据需要添加 getters
//   },
//   mutations: {
//     updateUser(state, user) {
//       state.id = user.id;
//       state.name = user.name;
//       state.completedCourses = user.completedCourses;
//       state.wishCourses = user.wishCourses;
//       state.communities = user.communities;
//       state.is_login = !!user.id;
//       state.access = user.access;
//       state.refresh = user.refresh;
//       // 新增属性的更新
//       state.gender = user.gender;
//       state.learning_style = user.learning_style;
//       state.activity_level = user.activity_level;
//       state.self_description = user.self_description;
//       state.communities_count = user.communities_count;
//     },
//     updateAccess(state, access) {
//       state.access = access;
//     },
//     logout(state) {
//       state.id = "";
//       state.name = "";
//       state.completedCourses = [];
//       state.wishCourses = [];
//       state.communities = [];
//       state.is_login = false;
//       state.is_recommending = false;
//       state.access = "";
//       state.refresh = "";
//     },
//     updateRecommendedCommunities(state, communities) {
//       state.recommendedCommunities = communities;
//     },
//     updateIsrecommending(state, b) {
//       state.is_recommending = b
//     }
//   },
//   actions: {
//     async fetchUser({ commit, state }) {
//       try {
//         if (!state.access || !state.id) {
//           throw new Error('Access token or user ID is missing');
//         }
//         const userInfoResponse = await axios.get("http://localhost:8000/getinfo/", {
//           headers: {
//             'Authorization': `Bearer ${state.access}`
//           },
//           params: {
//             type: 'student',
//             id: localStorage.getItem('id')
//           }
//         });
    
//         if (userInfoResponse.status === 200) {
//           // 这里我们根据新的后端接口返回的结构来解构userInfo
//           const {
//             id,
//             name,
//             gender,
//             learning_style,
//             activity_level,
//             self_description,
//             completed_courses,
//             wish_courses,
//             communities,
//             communities_count,
//           } = userInfoResponse.data;
    
//           commit("updateUser", {
//             id,
//             name,
//             gender,
//             learning_style,
//             activity_level,
//             self_description,
//             completedCourses: completed_courses,
//             wishCourses: wish_courses,
//             communities,
//             communities_count,
//             access: state.access,
//             refresh: state.refresh,
//             is_login: true,
//           });
//         } else {
//           throw new Error('Failed to fetch user info');
//         }
//       } catch (error) {
//         console.error('Fetch User Error:', error);
//         // Handle additional error, like redirecting to the login page
//       }
//     },
//     async login({ commit }, data) {
//       try {
//         const response = await axios.post("http://localhost:8000/api/token/", data);
    
//         if (response.status === 200) {
//           // Store access and refresh tokens in localStorage
//           localStorage.setItem('access_token', response.data.access);
//           localStorage.setItem('refresh_token', response.data.refresh);
//           const userInfoResponse = await axios.get("http://localhost:8000/getinfo/", {
//             headers: {
//               'Authorization': `Bearer ${response.data.access}`
//             },
//             params: {
//               type: 'student',
//               username: data.username
//             }
//           });
    
//           if (userInfoResponse.status === 200) {
//             const {
//               id,
//               name,
//               gender,
//               learning_style,
//               activity_level,
//               self_description,
//               completed_courses,
//               wish_courses,
//               communities,
//               communities_count,
//             } = userInfoResponse.data;

//             localStorage.setItem('id', id);

//             commit("updateUser", {
//               id,
//               name,
//               gender,
//               learning_style,
//               activity_level,
//               self_description,
//               completedCourses: completed_courses,
//               wishCourses: wish_courses,
//               communities,
//               communities_count,
//               access: response.data.access,
//               refresh: response.data.refresh,
//               is_login: true,
//             });
//             // Redirect to the home route or any other route after a successful login
//             router.push({name: 'home'});
//           } else {
//             throw new Error('Failed to fetch user info');
//           }
//         } else {
//           throw new Error('Login failed');
//         }
//       } catch (error) {
//         console.error('Login Error:', error);
//         // On user login failure, clear the tokens
//         localStorage.removeItem('id');
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         // Handle additional error, like showing an error message to the user
//       }
//     },
//     logout({ commit }) {
//       // 用户注销时清除 token
//       localStorage.removeItem('id');
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//       commit('logout');
//     },
//     restoreAuthState({ commit, dispatch }) {
//       const id = localStorage.getItem('id')
//       const accessToken = localStorage.getItem('access_token');
//       const refreshToken = localStorage.getItem('refresh_token');
//       if (accessToken && refreshToken) {
//         // 更新令牌信息但不设定用户其他状态为登录状态
//         commit('updateUser', {
//           id: id,
//           access: accessToken,
//           refresh: refreshToken,
//           // 不要在这里设置 is_login: true
//         });
    
//         // 再次调用 fetchUser 来获取完整用户信息
//         // 你可以考虑给 fetchUser 传递 accessToken，或是在 fetchUser 内部直接使用 state 中的 access 令牌
//         dispatch('fetchUser').then(() => {
//           // 用户信息获取成功后，跳转到home页面
//           router.push({name: 'home'});
//         }).catch(error => {
//           console.error('Error fetching user on restore:', error);
//           // 错误处理，例如如果令牌失效，则需要清除本地存储并注销用户
//           dispatch('logout');
//         });
  
//       } else {
//         commit('logout'); // 如果没有令牌或令牌失效，则执行登出操作
//       }
//     }, 
//     async fetchRecommendations({ commit, state }, { student_id, course_id }) {
//       try {
//         const response = await axios.post('http://localhost:8000/getrecommend/', {
//           student_id,
//           course_id
//         });
    
//         // 如果响应状态不是 200，则抛出错误。
//         if (response.status !== 200) {
//           throw new Error('Failed to fetch recommendations');
//         }
    
//         // 如果返回的数据是一个对象，并且包含了'error' 键，则抛出包含错误信息的异常。
//         if (response.data && typeof response.data === 'object' && 'error' in response.data) {
//           throw new Error(response.data.error);
//         }
    
//         // 将数据确保是数组后再进行后续处理。
//         let recommendedCommunities = Array.isArray(response.data) ? response.data : [];
    
//         // 标记每个推荐共同体是否已被添加到用户的共同体列表中。
//         recommendedCommunities = recommendedCommunities.map(community => ({
//           ...community,
//           joined: state.communities.some(c => c.id === community.id)
//         }));
    
//         // 更新 Vuex 状态。
//         commit('updateRecommendedCommunities', recommendedCommunities);
//       } catch (error) {
//         // 输出错误到控制台并抛出，以便可以进行适当的错误处理。
//         console.error('Fetch Recommendations Error:', error);
//         throw error;
//       }
//     },
//     joinOrLeaveCommunity: async ({ commit, dispatch, state }, { student_id, community_id, operation }) => {
//       try {
//         const response = await axios.post('http://localhost:8000/operation/', {
//           student_id,
//           community_id,
//           operation
//         });
//         if (response.data.error) {
//           throw new Error(response.data.error);
//         } else {
//           // 重新获取用户数据来确保状态的实时性
//           dispatch('fetchUser', student_id);
          
//           // 更新推荐的共同体
//           let updatedCommunities = state.recommendedCommunities.map(community => ({
//             ...community,
//             joined: community.id === community_id ? operation === 'join' : community.joined
//           }));
//           commit('updateRecommendedCommunities', updatedCommunities);
//         }
//       } catch (error) {
//         console.error(error);
//         throw error;
//       }
//     },
//     // 如果有其他 actions可以继续添加...
//   }
// };

//  export default ModuleUser;

//store/user.js
import axios from 'axios';
import router from '@/router';

const ModuleUser = {
  namespaced: true,
  state: {
    id: "",
    name: "",
    gender: '',
    learning_style: '',
    activity_level: '',
    self_description: '',
    completedCourses: [],
    wishCourses: [],
    communities: [],
    communities_count: 0,
    studentJoinRequests: [],
    communitiesApplications: [],
    access: "",
    refresh: "",
    is_login: false,
  },
  getters: {
    // 根据需要添加 getters
  },
  mutations: {
    updateUser(state, user) {
      state.id = user.id;
      state.name = user.name;
      state.gender = user.gender;
      state.learning_style = user.learning_style;
      state.activity_level = user.activity_level;
      state.self_description = user.self_description;
      // 修正字段名称以匹配后端返回的键
      state.completedCourses = user.completed_courses;
      state.wishCourses = user.wish_courses;
      state.communities = user.communities;
      state.communities_count = user.communities_count; // 如果后端用的是下划线请保持一致
      state.studentJoinRequests = user.student_join_requests;
      state.communitiesApplications = user.communities_applications;
      state.is_login = !!user.id;
      state.access = user.access;
      state.refresh = user.refresh;
    },
    updateAccess(state, access) {
      state.access = access;
    },
    logout(state) {
      // Reset all user state
      state.id = "";
      state.name = "";
      state.gender = '';
      state.learning_style = '';
      state.activity_level = '';
      state.self_description = '';
      state.completedCourses = [];
      state.wishCourses = [];
      state.communities = [];
      state.communities_count = 0;
      state.studentJoinRequests = [];
      state.communitiesApplications = [];
      state.is_login = false;
      state.access = "";
      state.refresh = "";
    },
    updateRecommendedCommunities(state, communities) {
      state.recommendedCommunities = communities;
    },
    updateIsrecommending(state, b) {
      state.is_recommending = b
    }
  },
  actions: {
    async fetchUser({ commit, state }) {
      try {
        // 如果没有 token 或用户 ID 则抛出错误
        if (!state.access || !state.id) {
          throw new Error('Access token or user ID is missing');
        }
        const userInfoResponse = await axios.get("http://localhost:8000/getinfo/", {
          headers: {
            'Authorization': `Bearer ${state.access}`
          },
          params: {
            type: 'student',
            id: state.id
          }
        });

        // 如果请求成功，使用 commit 调用 mutation 更新 state
        if (userInfoResponse.status === 200) {
          // 这里的解构应该与返回的 JSON 结构一致
          commit("updateUser", {
            ...userInfoResponse.data,
            access: state.access, refresh: state.refresh,
            is_login: true,
          });
        } else {
          throw new Error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Fetch User Error:', error);
      }
    },
    async login({ commit }, data) {
      try {
        const response = await axios.post("http://localhost:8000/api/token/", data);
    
        if (response.status === 200) {
          // Store access and refresh tokens in localStorage
          localStorage.setItem('access_token', response.data.access);
          localStorage.setItem('refresh_token', response.data.refresh);
          const userInfoResponse = await axios.get("http://localhost:8000/getinfo/", {
            headers: {
              'Authorization': `Bearer ${response.data.access}`
            },
            params: {
              type: 'student',
              username: data.username
            }
          });
    
          if (userInfoResponse.status === 200) {
            // 修正字段名称以匹配后端返回的键
            const {
              id,
              name,
              gender,
              learning_style,
              activity_level,
              self_description,
              completed_courses,
              wish_courses,
              communities,
              communities_count,
              student_join_requests,
              communities_applications,
            } = userInfoResponse.data;
    
            localStorage.setItem('id', id);
    
            commit("updateUser", {
              // 修正字段名称
              id,
              name,
              gender,
              learning_style,
              activity_level,
              self_description,
              completed_courses,
              wish_courses,
              communities,
              communities_count,
              student_join_requests,
              communities_applications,
              access: response.data.access,
              refresh: response.data.refresh,
              is_login: true,          
            });
            // Redirect to the home route or any other route after a successful login
            router.push({name: 'home'});
          } else {
            throw new Error('Failed to fetch user info');
          }
        } else {
          throw new Error('Login failed');
        }
      } catch (error) {
        console.error('Login Error:', error);
        // On user login failure, clear the tokens
        localStorage.removeItem('id');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Handle additional error, like showing an error message to the user
      }
    },
    logout({ commit }) {
      // 用户注销时清除 token
      localStorage.removeItem('id');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      commit('logout');
    },
    restoreAuthState({ commit, dispatch }) {
      const id = localStorage.getItem('id')
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      if (accessToken && refreshToken) {
        // 更新令牌信息但不设定用户其他状态为登录状态
        commit('updateUser', {
          id: id,
          access: accessToken,
          refresh: refreshToken,
          // 不要在这里设置 is_login: true
        });
    
        // 再次调用 fetchUser 来获取完整用户信息
        // 你可以考虑给 fetchUser 传递 accessToken，或是在 fetchUser 内部直接使用 state 中的 access 令牌
        dispatch('fetchUser').then(() => {
          // 用户信息获取成功后，跳转到home页面
          router.push({name: 'home'});
        }).catch(error => {
          console.error('Error fetching user on restore:', error);
          // 错误处理，例如如果令牌失效，则需要清除本地存储并注销用户
          dispatch('logout');
        });
  
      } else {
        commit('logout'); // 如果没有令牌或令牌失效，则执行登出操作
      }
    }, 
    async fetchRecommendations({ commit, state }, { student_id, course_id }) {
      try {
        const response = await axios.post('http://localhost:8000/getrecommend/', {
          student_id,
          course_id
        });
    
        // 如果响应状态不是 200，则抛出错误。
        if (response.status !== 200) {
          throw new Error('Failed to fetch recommendations');
        }
    
        // 如果返回的数据是一个对象，并且包含了'error' 键，则抛出包含错误信息的异常。
        if (response.data && typeof response.data === 'object' && 'error' in response.data) {
          throw new Error(response.data.error);
        }
    
        // 将数据确保是数组后再进行后续处理。
        let recommendedCommunities = Array.isArray(response.data) ? response.data : [];
    
        // 标记每个推荐共同体是否已被添加到用户的共同体列表中。
        recommendedCommunities = recommendedCommunities.map(community => ({
          ...community,
          joined: state.communities.some(c => c.id === community.id)
        }));
    
        // 更新 Vuex 状态。
        commit('updateRecommendedCommunities', recommendedCommunities);
      } catch (error) {
        // 输出错误到控制台并抛出，以便可以进行适当的错误处理。
        console.error('Fetch Recommendations Error:', error);
        throw error;
      }
    },
    joinOrLeaveCommunity: async ({ commit, dispatch, state }, { student_id, community_id, operation }) => {
      try {
        const response = await axios.post('http://localhost:8000/operation/', {
          student_id,
          community_id,
          operation
        });
        if (response.data.error) {
          throw new Error(response.data.error);
        } else {
          // 重新获取用户数据来确保状态的实时性
          dispatch('fetchUser', student_id);
          
          // 更新推荐的共同体
          let updatedCommunities = state.recommendedCommunities.map(community => ({
            ...community,
            joined: community.id === community_id ? operation === 'join' : community.joined
          }));
          commit('updateRecommendedCommunities', updatedCommunities);
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },// 在 user.js Vuex模块的 actions 部分添加
    handleJoinRequest({  state }, { joinRequestId, actionType }) {
      return new Promise((resolve, reject) => {
        axios.post(`http://localhost:8000/community/join_request/${joinRequestId}/${actionType}/`, {}, {
          headers: {
            'Authorization': `Bearer ${state.access}`  // 使用Bearer令牌进行认证
          }
        })
        .then(response => {
          if (response.data.status === 'success') {
            // 这里可以根据后端返回的成功响应进行一些状态更新或者其他操作
            // 比如，你可能需要更新 state 中的 studentJoinRequests 或 communitiesApplications 等
            console.log('Join request processed successfully');
            resolve(response.data);
          } else {
            reject(response.data.message);
          }
        })
        .catch(error => {
          console.error('Error handling join request:', error);
          reject(error);
        });
      });
    },
    
    // 你可以根据需要添加额外的 actions，例如处理登录，注销，更新推荐等等
    // ...
  } 
};

export default ModuleUser;