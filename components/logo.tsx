import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  variant?: "dark" | "light"
  size?: "sm" | "md" | "lg"
  href?: string | null
}

export default function Logo({ variant = "dark", size = "md", href = "/" }: LogoProps) {
  const sizes = { sm: 28, md: 36, lg: 48 }
  const textSizes = { sm: "text-sm", md: "text-base", lg: "text-xl" }
  const px = sizes[size]

  const inner = (
    <span className="flex items-center gap-2">
      <Image
        src="/banklogo.png"
        alt="BlueStone Trust Bank"
        width={px}
        height={px}
        className="object-contain"
        priority
      />
      <span
        className={`font-bold tracking-tight ${textSizes[size]} ${
          variant === "light" ? "text-white" : "text-[#0c2d4e]"
        }`}
      >
        BlueStone
        <span
          className={`font-normal ${
            variant === "light" ? "text-sky-300" : "text-[#1a6fad]"
          }`}
        >
          {" "}Trust Bank
        </span>
      </span>
    </span>
  )

  if (!href) return inner
  return (
    <Link href={href} className="inline-flex items-center">
      {inner}
    </Link>
  )
}
