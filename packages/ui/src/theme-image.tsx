import Image, { type ImageProps } from 'next/image';

type Props = Omit<ImageProps, 'src'> & {
  srcLight: string;
  srcDark: string;
};

export const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, className, ...rest } = props;

  return (
    <>
      <Image
        {...rest}
        src={srcLight}
        className={`${className || ''} imgLight`.trim()}
      />
      <Image
        {...rest}
        src={srcDark}
        className={`${className || ''} imgDark`.trim()}
      />
    </>
  );
};
