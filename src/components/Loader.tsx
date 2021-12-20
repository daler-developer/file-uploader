import classNames from "classnames"

type Props = {
  className?: string,
}

export default ({ className }: Props) => {
  return (
    <div className={classNames('loader', className)}>
      
    </div>
  )
}
