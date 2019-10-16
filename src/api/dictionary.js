export const orderStatus = {
  1 : '待付款',
  2 : '已付款',
  3 : '已寄样',
  4 : '已收样',
  5 : '检测中',
  6 : '检测完成',
  7 : '待收单',
  8 : '已完成',
  9 : '已取消',
}

export const orderStatusValue = [
  {value: 1, meg: '待付款'},
  {value: 2, meg: '已付款'},
  {value: 3, meg: '已寄样'},
  {value: 4, meg: '已收样'},
  {value: 5, meg: '检测中'},
  {value: 6, meg: '检测完成'},
  {value: 7, meg: '待收单'},
  {value: 8, meg: '已完成'},
  {value: 9, meg: '已取消'},
]

export const paymentTypes = {
  1 : '支付宝',
  2 : '微信',
  3 : '银联'
}

export const isUrgent = {
  0: '常规',
  1: '加急'
}

// 企业认证审核
export const checkStatus = {
  0 : '待审核', 1 : '审核成功', 2 : '审核失败'
}

export const statusClass = {
  0 : 'primary', 1 : 'success', 2 : 'danger'
}

// 打款审核
export const checkAccountStatus = {
  0 : '提交中', 1 : '已打款', 2 : '打款成功',3 : '打款失败'
}
export const accountstatusClass = {
  0 : 'primary', 1 : 'success', 2 : 'success', 3 : 'danger'
}

// 发票类型
export const invoiceType = {0 : '企业增值税专用发票', 1 : '企业增值税普通发票'}

// 发票状态
export const invoiceStatus = {0 : '待确认',1 : '已确认',2 : '已结算',3 : '未开票',4 : '已开票'}

//判断需求方还是检测方
export const inspectors = {
  0: '检测方',
  1: '需求方'
}

//操作历史文字显示
export const orderHistoryText = {
  1 : '提交订单',
  2 : '支付成功',
  3 : '已经寄样',
  4 : '已收样',
  5 : '开始检测',
  6 : '上传报告单 检测完成',
  7 : '填写快递信息 已邮寄 10天后默认确认',
  8 : '确认收货',
  9 : '已取消',
}

//取消原因
export const cancelReasonText = {
  1 : '不想买了',
  2 : '信息填写错误，重新拍',
  3 : '卖家缺货',
  4 : '付款遇到问题',
  5 : '选错了',
  6 : '其他原因',
  7 : '超时未支付，自动取消',
}
