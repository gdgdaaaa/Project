# views/getInformation/index.py
from django.db.models import Count
from rest_framework import views, permissions, response
from django.core.exceptions import ObjectDoesNotExist  # 如果你使用的是自定义异常处理
from demo.models import Community, CommunityJoinRequest
from demo.repositories.community_repository import CommunityRepository
from demo.repositories.student_repository import StudentRepository


class GetInfoView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_community_info(self, community):
        if community.members.count() == 1:
            return {
                'error': 'Not Found!'
            }
        # 获取社区成员及其基本信息
        members_json = [{'id': student.student_id,
                         'name': student.name,
                         'gender': student.get_gender_display(),
                         'learning_style': student.get_learning_style_display(),
                         'self_description': student.self_description}
                        for student in community.members.all()]
        # 获取已完成的课程
        completed_courses_json = [{'id': cc.course.course_id, 'name': cc.course.name, 'member_ratio': cc.member_ratio}
                                  for cc in community.completedcourse_set.all()]

        # 获取愿望课程
        wish_courses_json = [{'id': wc.course.course_id, 'name': wc.course.name, 'member_ratio': wc.member_ratio}
                             for wc in community.wishcourse_set.all()]

        return {
            'id': community.id,
            'name': community.name,
            'description': community.description,
            'gender_ratio': community.gender_ratio,
            'learning_style': community.learning_style,
            'activity_level': community.activity_level,
            'members_count': community.members.count(),
            'members': members_json,
            'completed_courses': completed_courses_json,
            'wish_courses': wish_courses_json,
        }

    def get_student_info(self, student):

        # 获取已完成的课程
        completed_courses_json = [{'id': cc.course.course_id, 'name': cc.course.name, 'score': cc.score}
                                  for cc in student.completedcourse_set.all()]

        # 获取愿望课程
        wish_courses_json = [{'id': wc.course.course_id, 'name': wc.course.name}
                             for wc in student.wishcourse_set.all()]

        # 获取已加入的共同体及其基本信息
        # 使用annotate来给每个Community添加成员数的注释，并用filter过滤出成员数大于1的Community
        communities_with_more_than_one_member = Community.objects.annotate(
            num_members=Count('members', distinct=True)
        ).filter(num_members__gt=1)

        # 获取该学生对其他共同体的加入申请信息
        student_join_requests = CommunityJoinRequest.objects.filter(student=student).select_related('community')
        student_join_requests_json = [
            {
                'community_id': req.community.id,
                'community_name': req.community.name,
                'status': req.status
            } for req in student_join_requests
        ]

        # 对于学生参与的社区，我们可以再使用一个过滤器来进一步筛选
        student_communities_with_more_than_one_member = communities_with_more_than_one_member.filter(
            members=student
        )
        communities_json = [
            {
                'id': cm.id,
                'name': cm.name,
                'count': cm.members.count(),
                'description': cm.description
            }
            for cm in student_communities_with_more_than_one_member
        ]

        # 获取该学生所在共同体的所有申请信息
        communities_applications_json = []
        for community in communities_with_more_than_one_member.all():
            # 获取当前社区的所有加入申请信息
            join_requests = CommunityJoinRequest.objects.filter(community=community).select_related('student')
            if not join_requests.exists():
                continue
            join_requests_json = [
                {
                    'applicant_name': req.student.name,
                    'status': req.status
                } for req in join_requests
            ]

            communities_applications_json.append({
                'community_id': community.id,
                'community_name': community.name,
                'applications': join_requests_json
            })
        return {
            'id': student.student_id,
            'name': student.name,
            'gender': student.get_gender_display(),
            'learning_style': student.get_learning_style_display(),
            'activity_level': student.activity_level,
            'self_description': student.self_description,
            'completed_courses': completed_courses_json,
            'wish_courses': wish_courses_json,
            'communities_count': len(communities_json),
            'communities': communities_json,
            'student_join_requests': student_join_requests_json,
            'communities_applications': communities_applications_json,
        }

    def get(self, request, *args, **kwargs):
        who = request.query_params.get('type')
        ID = request.query_params.get('id')
        username = request.query_params.get('username')

        try:
            if who == 'community':
                community = CommunityRepository.get_community_by_id(int(ID))
                return response.Response(self.get_community_info(community))
            elif who == 'student':
                if username:
                    student = StudentRepository.get_student_by_name(username)
                else:
                    student = StudentRepository.get_student_by_id(ID)
                return response.Response(self.get_student_info(student))
            else:
                return response.Response({'error': 'Wrong type'}, status=400)
        except (ValueError, ObjectDoesNotExist) as e:
            return response.Response({'error': str(e)}, status=404)


