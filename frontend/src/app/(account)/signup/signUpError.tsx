export default function SignUpError({ error }: { error: Error | null }) {
  if (!error) return null
  let message = ''

  if (error.message === 'Already exist nickname')
    message = '이미 존재하는 닉네임입니다.'
  else if (error.message === 'email must be an email')
    message = '올바른 이메일 형식이어야 합니다.'
  else message = '현재 가입할 수 없습니다.'

  return <p className="text-sm text-destructive mt-3">{message}</p>
}
