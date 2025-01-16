interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean
}

function LazyImage({ priority = false, ...props }: LazyImageProps) {
  return (
    <img
      {...props}
      loading={priority ? 'eager' : 'lazy'}
      className={`w-full h-full object-cover ${props.className || ''}`}
    />
  )
}

export default LazyImage
