export default function Page() {

    return (
      <div className="flex w-full h-full">
        <div className="flex flex-col w-full h-full bg-[#f5f5f5]">
          <div className="flex h-full">
            <div className="w-full min-h-screen text-black flex items-center justify-center p-4">
              <div className="max-w-md w-full text-center">
                <h1 className="text-6xl font-bold mb-4 animate-pulse">404</h1>
                <p className="text-xl mb-8">Oops! Página não encontrada.</p>
                <div className="w-16 h-16 mx-auto mb-8 border-4 border-black rounded-lg animate-spin-slow"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}