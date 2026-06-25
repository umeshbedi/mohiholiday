import React from "react";
import Image from "next/image";


export default function MegaMenu({ content = [] }) {
  // console.log(content)
  return (
    <div className=" bg-white rounded-xl shadow-lg p-2">
      <ul className="list-none m-0 p-0">
        <li className="auto-columns">
          <div className="content">
            {content.map((item, i) => (
              <div key={i} className="hover:bg-[#e0f5fd]/40 rounded-xl pb-1 p-1 transition-colors duration-250">
                <a 
                  href={item?.slug.split("/")[1] !== 'activity' ? item.slug : "javascript:void(0)"} 
                  className="flex gap-2 bg-[var(--primaryColor)] text-white p-3 rounded-2xl items-center hover:opacity-95 transition-opacity"
                >
                  {item.thumbnail != undefined && (
                    <div className="relative h-[30px] w-[30px] flex-shrink-0">
                      <Image 
                        src={item.thumbnail} 
                        fill 
                        className="object-cover rounded-lg" 
                        alt={item.name} 
                      />
                    </div>
                  )}
                  <p className="font-bold text-white m-0 leading-none">{item.name}</p>
                </a>
                
                {item.data.map((itm, index) => (
                  <a 
                    href={itm.slug} 
                    key={index} 
                    className="flex gap-2 my-2 ml-1 p-2 hover:bg-white hover:shadow-sm rounded-l-3xl items-center transition-all duration-200 text-gray-700 hover:text-[var(--primaryColor)]"
                  >
                    <div className="relative h-[30px] w-[30px] flex-shrink-0">
                      <Image 
                        src={itm.thumbnail || "/img/logos/logo-header.png"} 
                        fill 
                        className="object-cover rounded-full" 
                        alt={itm.title} 
                      />
                    </div>
                    <p className="m-0 leading-none text-sm font-medium">{itm.title}</p>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </li>
      </ul>
    </div>
  );
};

