import ChatLists from './chatLists'

export default function DirectLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex items-center">
      <ChatLists />
      <div className="flex w-full h-full justify-center items-center">
        {props.children}
      </div>
    </div>
  )
}
