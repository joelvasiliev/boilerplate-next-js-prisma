'use client'

import { Portal } from '@radix-ui/react-portal'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as React from 'react'

import { cn } from '@/lib/utils'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <Portal>
        <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                'flex z-[201] max-w-60 truncate flex-wrap text-center text-wrap break-words rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                className,
            )}
            {...props}
        />
    </Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

const Tippy = ({
    active = true,
    className,
    variant = 'default',
    children,
    tippy,
    side = 'top',
}: {
    variant?: 'default' | 'error' | 'success'
    children: React.ReactNode
    className?: string
    active?: boolean
    tippy: string | React.ReactNode
    side?: 'top' | 'right' | 'bottom' | 'left'
}) =>
    active ? (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent
                    side={side}
                    className={cn(
                        className,
                        variant === 'error' && 'bg-destructive text-destructive-foreground',
                    )}
                >
                    <b>{tippy}</b>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ) : (
        children
    )

export { Tippy, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
