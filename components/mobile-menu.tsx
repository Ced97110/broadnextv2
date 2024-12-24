'use client'


import React, { useState, useEffect } from "react"
import Link from "next/link"
import { FiChevronDown, FiX } from "react-icons/fi"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import { useUser } from "@auth0/nextjs-auth0/client"
import { usePathname } from "next/navigation"

import { MenuLinks } from "./header"
import { VercelLogo } from "./icons"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { MdOutlineExitToApp } from "react-icons/md"

/**
 * Example Tailwind-based Button component.
 * You can replace this with your own Button if desired.
 */

export const MobileMenu = () => {
  const { user } = useUser()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const handleLogout = () => {
    window.location.href = "/api/auth/logout"
  }

  // Close if viewport is resized above mobile width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      {/* HAMBURGER BUTTON */}
      <Button
        variant='outline'
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-transparent text-white"
      >
        <HamburgerMenuIcon className="h-4 w-4" />
      </Button>

      <div
        className={`fixed inset-0 z-50 flex transform items-center justify-center transition duration-300 ease-in-out
          ${isOpen ? "opacity-100 bg-white scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
        style={{
          backdropFilter: "blur(8px)", // for a frosted glass effect
        }}
        onClick={handleClose}
      >
       
        <div
          className="relative flex h-full w-full flex-col bg-transparent p-4 md:max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <VercelLogo width={40} height={40} color="text-black dark:text-white" />
            </div>
            <Button
              variant="outline"
              onClick={handleClose}
              className="bg-transparent text-2xl"
            >
              <FiX className="text-black "/>
            </Button>
          </div>

          {/* MENU LINKS */}
          <div className="mb-4 flex flex-col space-y-2">
            {MenuLinks?.length
              ? MenuLinks.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={handleClose}
                    className="
                      block rounded-md px-4 py-2 text-sm font-medium 
                      text-gray-800 transition-colors hover:bg-gray-200 
                      dark:text-gray-100 dark:hover:bg-gray-800
                    "
                  >
                    {item.name}
                  </Link>
                ))
              : null}
          </div>

          {/* FOOTER */}
          <div className="mt-auto border-t border-gray-300 pt-4 dark:border-gray-700">
            {user ? (
              <>
               <div className="flex">
                  <Avatar>
                    <AvatarImage src={user.picture}  alt={user.name} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <FiChevronDown className="ml-1 text-white" />
            
                <Button
                  onClick={handleLogout}
                  className="flex items-center focus:outline-none rounded-full"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                >
                  Logout
                  <MdOutlineExitToApp className="ml-1 text-white" />
                </Button>
               </div>
              </>
             
            ) : (
              <Link href="/api/auth/login" onClick={handleClose}>
                <Button className="border border-gray-400 rounded-full">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}