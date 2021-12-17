
type Props = {
  children: any
}

export default  ({ children }: Props) => {
  return (
    <div className={'container'}>
      {children}
    </div>
  )
}
