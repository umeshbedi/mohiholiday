import React from "react";
import Image from "next/image";


export default function MegaMenu({ content = [] }) {

  return (
    <ul className=" list-none">
      <li className="auto-columns">
        <div className="content">
          {content.map((item, i) => (
            <div key={i} className="hover:bg-cyan-200">
              <a href={item.url == undefined ? "javascript:void(0)" : item.url} className="flex gap-2 bg-slate-200 hover:bg-cyan-300 p-3">
                <Image src={item.icon} width={30} height={30} />
                <p className=" font-bold">{item.name}</p>
              </a>
              {item.items.map((itm, index) => (
                <a href={itm.slug} key={index} className="flex gap-2 mb-2 hover:bg-cyan-100">
                  <Image src={itm.icon} width={30} height={30} />
                  {itm.name}</a>
              ))}
            </div>
          ))}
        </div>
      </li>
    </ul>
  );
};

