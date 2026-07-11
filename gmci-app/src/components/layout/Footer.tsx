

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-400">
          &copy; {currentYear} Global Mission For Christ International. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
