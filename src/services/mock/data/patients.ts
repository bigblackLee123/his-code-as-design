import type { Patient } from "../../types";

/**
 * 模拟患者数据 — 与后端 seed.sql 对齐
 * P001 为 seed 中的完整流程患者，其余为候诊/演示用
 */
export const mockPatients: Patient[] = [
  {
    id: "P001",
    name: "张三",
    gender: "male",
    age: 45,
    idNumber: "310101197801010011",
    phone: "13800138000",
    insuranceCardNo: "YB2024001",
    status: "completed",
    createdAt: "2024-01-15T08:30:00Z",
  },
  {
    id: "P002",
    name: "李秀英",
    gender: "female",
    age: 52,
    idNumber: "320106197303082345",
    phone: "13698765432",
    insuranceCardNo: "YB2024002",
    status: "waiting",
    createdAt: "2024-01-15T08:45:00Z",
  },
  {
    id: "P003",
    name: "王建国",
    gender: "male",
    age: 72,
    idNumber: "440103195207203456",
    phone: "15012349876",
    insuranceCardNo: "YB2024003",
    status: "consulting",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "P004",
    name: "赵美玲",
    gender: "female",
    age: 38,
    idNumber: "510105198605124567",
    phone: "18623456789",
    insuranceCardNo: "YB2024004",
    status: "pending-treatment",
    createdAt: "2024-01-15T09:15:00Z",
  },
  {
    id: "P005",
    name: "陈志远",
    gender: "male",
    age: 55,
    idNumber: "330102196901085678",
    phone: "13756781234",
    insuranceCardNo: "YB2024005",
    status: "treating",
    createdAt: "2024-01-15T09:30:00Z",
  },
  {
    id: "P006",
    name: "刘芳华",
    gender: "female",
    age: 62,
    idNumber: "210103196208156789",
    phone: "15898761234",
    insuranceCardNo: "YB2024006",
    status: "checked-in",
    createdAt: "2024-01-15T09:45:00Z",
  },
];
