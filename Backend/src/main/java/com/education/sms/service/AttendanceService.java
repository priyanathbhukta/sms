package com.education.sms.service;

import com.education.sms.dto.AttendanceRequest;
import com.education.sms.dto.AttendanceResponse;
import com.education.sms.entity.Attendance;

import java.util.List;

public interface AttendanceService {

    String markAttendance(AttendanceRequest request);
    List<AttendanceResponse> getAttendanceByStudentId(Long studentId);
    List<AttendanceResponse> getAttendanceByStudentAndSubjectId(Long studentId, Long sujectId);
}
