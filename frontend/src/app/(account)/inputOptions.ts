export const nicknameOption = {
  required: true,
  minLength: {
    value: 4,
    message: '비밀번호는 최소 4자 이상이어야 합니다',
  },
  maxLength: {
    value: 30,
    message: '비밀번호는 최대 30자 이하이어야 합니다',
  },
}

export const emailOption = {
  required: true,
  pattern: {
    value: /\S+@\S+\.\S+/,
    message: '올바른 이메일 형식이 아닙니다.',
  },
}

export const passwordOption = {
  required: true,
  minLength: {
    value: 4,
    message: '비밀번호는 최소 4자 이상이어야 합니다',
  },
  maxLength: {
    value: 30,
    message: '비밀번호는 최대 30자 이하이어야 합니다',
  },
}
