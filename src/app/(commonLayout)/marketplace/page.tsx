"use client";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

const MarketplacePage = () => {
  const list = [
    {
      title: "Orange",
      img: "https://www.pashley.co.uk/cdn/shop/files/pashley-kingsman-bicycle-royal-blue.jpg?v=1683215278",
      price: "$5.50",
    },
  ];
  return (
    <div className=" flex ">
      <div className="hidden lg:block  lg:w-[20%] fixed h-screen overflow-y-auto ">
        {/* <SidebarMenu /> */}
      </div>

      {/* <div className={`hidden md:block  md:w-[80%]`}> */}
      <div className=" lg:block   lg:ml-[20%] mx-auto w-full md:w-[80%] ">
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 p-4">
          {list.map((item, index) => (
            /* eslint-disable no-console */
            <Card
              key={index}
              isPressable
              shadow="sm"
              onPress={() => console.log("item pressed")}
            >
              <CardBody className="overflow-visible p-0">
                <Image
                  alt={item.title}
                  className="w-full object-cover h-[140px]"
                  radius="lg"
                  shadow="sm"
                  src={item.img}
                  width="100%"
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <b>{item.title}</b>
                <p className="text-default-500">{item.price}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
