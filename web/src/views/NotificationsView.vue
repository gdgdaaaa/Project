<template>
  <ContentBase>
    <div class="container py-5">
      <div class="card">
        <div class="card-header">
          <h1 class="text-center">消息中心</h1>
        </div>
        <div class="card-body">
          <div class="row">
            <div v-if="isLogin" class="col-md-6">
              <!-- 当前用户的社区申请显示区 -->
              <div class="card">
                <div class="card-body">
                  <h2 class="h5 card-title">你的加入请求</h2>
                  <div v-for="request in studentJoinRequests" :key="request.community_id">
                    <div class="card mb-3">
                      <div class="card-body">
                        <!-- 展示当前用户发出的加入请求信息 -->
                        <p class="card-text">{{ request.community_name }} - <span class="badge bg-primary">{{ request.status }}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="isLogin" class="col-md-6">
              <!-- 针对用户所在共同体的申请显示区 -->
              <div class="card">
                <div class="card-body">
                  <h2 class="h5 card-title">其他用户加入你的共同体请求</h2>
                  <div v-for="community in communitiesApplications" :key="community.community_id">
                    <div class="card mb-3">
                      <div class="card-body">
                        <h5 class="card-title">{{ community.community_name }}</h5>
                        <div v-for="application in community.applications" :key="application.applicant_name">
                          <p class="card-text">{{ application.applicant_name }} 想要加入 - <span class="badge bg-primary">{{ application.status }}</span></p>
                          <!-- 绑定handleJoinRequest方法并传递参数 -->
                          <button class="btn btn-success btn-sm" @click="handleJoinRequest(application.applicant_name, 'approve')">同意</button>
                          <button class="btn btn-danger btn-sm" @click="handleJoinRequest(application.applicant_name, 'reject')">拒绝</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <p>你还未登录，请先登录。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ContentBase>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'NotificationsView',
  setup() {
    const store = useStore();
    const studentJoinRequests = computed(() => store.state.user.studentJoinRequests); // 加入请求
    const communitiesApplications = computed(() => store.state.user.communitiesApplications); //所在共同体的消息
    const isLogin = computed(() => store.state.user.is_login);

    // 定义处理加入请求的方法，调用 Vuex action
    const handleJoinRequest = (joinRequestId, actionType) => {
      store.dispatch('user/handleJoinRequest', { joinRequestId, actionType })
        .then(() => {
          alert('操作成功');
          // 此处可以添加更多的响应逻辑，比如重新获取请求列表
        })
        .catch(error => {
          console.error('操作失败:', error);
          alert('操作失败');
        });
    };

    return {
      studentJoinRequests,
      communitiesApplications,
      isLogin,
      handleJoinRequest,
    };
  },
};
</script>

<style scoped>
/* 可以根据需要添加额外的样式 */
.notification .card {
  background-color: #f8f9fa;
}

.notification .btn {
  margin-right: 10px;
}
</style>