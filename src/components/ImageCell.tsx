interface ImageCellProps {
  url: string;
}

const ImageCell: React.FC<ImageCellProps> = ({ url }) => {
  return (
    <a href={url} target="_blank">
      <img src={url} className="w-20 h-20 rounded-xl" />
    </a>
  );
};
export default ImageCell;
