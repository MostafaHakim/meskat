import Navbar from "../components/Navbar";
const Mosquitonet = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Navbar />
      <div className="w-full flex flex-col items-start justify-start p-4">
        <h2 className="text-2xl pb-4">Mosquito Net</h2>
        <div className="flex flex-col itesm-center justify-between space-y-2">
          <img
            className="w-full h-78 "
            src="https://picsum.photos/200/300"
            alt="Product"
          />
          <div className="flex flex-row gap-2">
            <div>
              <img
                className="w-20 h-20"
                src="https://picsum.photos/200/300"
                alt="Product"
              />
              <h2>Red</h2>
              <h2>6 / 7 </h2>
            </div>
            <div>
              <img
                className="w-20 h-20"
                src="https://picsum.photos/200/300"
                alt="Product"
              />
              <h2>Red</h2>
              <h2>6 / 7 </h2>
            </div>
            <div>
              <img
                className="w-20 h-20"
                src="https://picsum.photos/200/300"
                alt="Product"
              />
              <h2>Red</h2>
              <h2>6 / 7 </h2>
            </div>
            <div>
              <img
                className="w-20 h-20"
                src="https://picsum.photos/200/300"
                alt="Product"
              />
              <h2>Red</h2>
              <h2>6 / 7 </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mosquitonet;
