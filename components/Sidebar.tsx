import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Sidebar.css";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Link } from "wouter";
import { JSX } from "react";

export class Menu {
  title: string = "";
  icon: IconDefinition = faQuestion;
  items: MenuItem[] = [];

  constructor(title: string, icon: IconDefinition, items: MenuItem[]) {
    this.title = title;
    this.icon = icon;
    this.items = items;
  }
}

export class MenuItem {
  title: string = "";
  icon: IconDefinition = faQuestion;
  link: string = "";

  constructor(title: string, icon: IconDefinition, link: string) {
    this.title = title;
    this.icon = icon;
    this.link = link;
  }
}

export interface SidebarProps {
  appName: string;
  logo: string;
  menus: Menu[];
  footer?: JSX.Element;
}

export const Sidebar = (props: SidebarProps) => {
  return (
    <nav
      id="sidebar"
      className="px-1 border-end border-bottom border-light-subtle rounded"
    >
      <div className="mb-4">
        <Link to="/" className="nav-brand text-decoration-none">
          <div className="text-center">
            {props.logo && (
              <img
                src={props.logo}
                className="rounded"
                alt={props.appName}
                title={props.appName}
                width="32"
                height="32"
              />
            )}
          </div>
        </Link>
      </div>

      <div id="sidebar-items">
        <ul className="list-unstyled text-center">
          {props.menus.map((menu) => {
            return (
              <li key={menu.title}>
                <FontAwesomeIcon
                  icon={menu.icon}
                  size="xl"
                  className="mb-2 text-primary"
                  title={menu.title}
                />
                <ul className="list-unstyled">
                  {menu.items.map((item) => {
                    return (
                      <li key={item.title}>
                        <Link to={item.link}>
                          <FontAwesomeIcon
                            icon={item.icon}
                            title={item.title}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <hr />
              </li>
            );
          })}
        </ul>
      </div>
      {props.footer ? (
        <div id="sidebar-footer" className="pb-1">
          {props.footer}
        </div>
      ) : null}
    </nav>
  );
};
