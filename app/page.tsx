import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Github, Twitter } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Folio<span className="text-blue-600">mesh</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Create stunning portfolios without coding. Showcase your work, connect with opportunities, 
            and let the world see your talent.
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <Button size="lg" asChild>
              <Link href="/auth/signin">Empezar gratis</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">Ver características</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-3">No Code Required</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Drag, drop, and customize. Create professional portfolios with our intuitive editor.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-3">GitHub Integration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Automatically showcase your projects from GitHub with live stats and descriptions.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-3">Global Reach</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your portfolio automatically translates for visitors from around the world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}