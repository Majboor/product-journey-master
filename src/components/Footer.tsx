import { Mail, Phone } from "lucide-react";
import { Contact, FooterLink } from "@/types/content";

interface FooterProps {
  brandName: string;
  contact: Contact;
  links: FooterLink[];
}

const Footer = ({ brandName, contact, links }: FooterProps) => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{brandName}</h3>
            <p className="text-gray-400">
              Top-quality products for your needs.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="text-gray-400 hover:text-white">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                {contact.email}
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                {contact.phone}
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe for exclusive updates.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded bg-gray-800 text-white mb-2"
            />
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 {brandName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;