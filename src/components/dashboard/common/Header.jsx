const Header = ({ title }) => {
  return (
    <header className="bg-white bg-opacity-100 backdrop-blur-lg shadow-lg border-b border-blue-300">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-blue-600 drop-shadow-md">
          {title}
        </h1>
      </div>
    </header>
  );
};
export default Header;
