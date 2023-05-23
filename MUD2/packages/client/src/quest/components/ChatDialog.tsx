export const ChatDialog = ({
  onChat = (e: boolean) => { },
}) => {
  // const {
  //   components: { Position, Location },
  //   network: { playerEntity },
  // } = useMUD()


  return (
    <div>
      <div className='ChatCover' onClick={() => onChat(false)}/>
      <div className='ChatDialog'>

      </div>
    </div>
  )
}
