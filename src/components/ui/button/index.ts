import { type VariantProps, cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'nsc-inline-flex ns-citems-center nsc-justify-center nsc-whitespace-nowrap nsc-rounded-md nsc-text-sm nsc-font-medium nsc-ring-offset-background nsc-transition-colors focus-visible:nsc-outline-none focus-visible:nsc-ring-2 focus-visible:nsc-ring-ring focus-visible:nsc-ring-offset-2 disabled:nsc-pointer-events-none disabled:nsc-opacity-50',
  {
    variants: {
      variant: {
        default: 'nsc-bg-primary nsc-text-primary-foreground hover:nsc-bg-primary/90',
        secondary:
          'nsc-bg-secondary nsc-text-secondary-foreground hover:nsc-bg-secondary/80',
      },
      size: {
        default: 'nsc-px-4 nsc-py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
