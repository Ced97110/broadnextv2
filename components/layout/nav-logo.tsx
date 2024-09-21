import Image from 'next/image';
import Link from 'next/link';

export default function NavLogo({ width, height }) {
  return (
    <Link className="flex items-center gap-1" href="/">
      <Image 
        src="/logo.png" 
        alt="Logo" 
        width={width} 
        height={height}
      />
      <span className="font-semibold text-lg">Broadwalk</span>
    </Link>
  );
};