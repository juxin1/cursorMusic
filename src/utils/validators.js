export const validateEmail = (email) => {
  if (!email) {
    return '邮箱不能为空'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return '请输入有效的邮箱地址'
  }
  return ''
}

export const validatePassword = (password) => {
  if (!password) {
    return '密码不能为空'
  }
  if (password.length < 6) {
    return '密码长度至少为6位'
  }
  const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};:'",.<>/?]*$/
  if (!passwordRegex.test(password)) {
    return '密码只能包含字母、数字和特殊字符'
  }
  return ''
} 