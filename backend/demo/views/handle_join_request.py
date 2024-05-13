from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from demo.models import CommunityJoinRequest


# 按照Django的CSRF保护机制，如果你的前端和后端不在相同的域，则可能需要添加 @csrf_exempt 装饰器
@require_http_methods(['POST'])
def handle_join_request(request, join_request_id, action):
    """
    处理社区加入请求
    :param request: HTTP请求对象
    :param join_request_id: 社区加入请求的ID
    :param action: 表示操作的字符串，例如 'approve' 或 'reject'
    """

    try:
        join_request = CommunityJoinRequest.objects.get(pk=join_request_id)
        student_id = request.user.id  # 假设你在使用Django的认证系统
        if action == 'approve':
            # 如果是同意操作，调用 approve_request 方法
            join_request.approve_request(student_id)
        elif action == 'reject':
            # 如果是拒绝操作，可以在这里实现
            # 对于这个模型，你可能要添加一个 reject_request 方法
            pass
        # 操作完成。返回成功的响应。
        return JsonResponse({
            'status': 'success',
            'message': 'The request has been processed successfully.'
        })
    except CommunityJoinRequest.DoesNotExist:
        # 社区加入请求不存在
        return JsonResponse({'status': 'error', 'message': 'Join request does not exist.'}, status=404)
    except Exception as e:
        # 捕获其他异常，并返回错误信息
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)