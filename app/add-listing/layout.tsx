import { createAddListingMetadata } from '@/lib/metadata'

export const metadata = createAddListingMetadata()

export default function AddListingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}