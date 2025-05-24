import Home from "./components/Home";

function App() {
  return (
    <div className="p-3 flex flex-col justify-center items-center h-screen">
      <header className="text-center">
        <h1 className="font-bold text-3xl">AI Image Enhancer</h1>
        <p className="text-gray-600">Upload your image and let AI enchance to in seconds!</p>
      </header>
      <Home />
      <footer className="mt-6 text-sm text-gray-500">Powered by <span className="font-semibold">@Essa</span></footer>

    </div>
  );
}

export default App;
