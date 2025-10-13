import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { Member, RouterQuery } from "../types";

export default function MembershipApproval(): JSX.Element {
  const router = useRouter();
  const { m: memberParam, p: price, l: link }: RouterQuery = router.query;
  const [member, setMember] = useState<Member | null>(null);

  // Function to convert Roman numerals to Arabic numbers
  const romanToArabic = (roman: string): number => {
    const romanNumerals: { [key: string]: number } = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000,
    };

    let result = 0;
    let prevValue = 0;

    // Process from right to left
    for (let i = roman.length - 1; i >= 0; i--) {
      const currentValue = romanNumerals[roman[i].toUpperCase()];

      if (currentValue === undefined) {
        throw new Error(`Invalid Roman numeral: ${roman[i]}`);
      }

      if (currentValue < prevValue) {
        result -= currentValue;
      } else {
        result += currentValue;
      }

      prevValue = currentValue;
    }

    return result;
  };

  // Function to format price with commas for numbers greater than 1000
  const formatPrice = (price: string): string => {
    const numericPrice = parseFloat(price);
    if (numericPrice >= 1000) {
      return numericPrice.toLocaleString();
    }
    return price;
  };

  // Function to convert Arabic numbers to Roman numerals
  const arabicToRoman = (num: number): string => {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = [
      "M",
      "CM",
      "D",
      "CD",
      "C",
      "XC",
      "L",
      "XL",
      "X",
      "IX",
      "V",
      "IV",
      "I",
    ];

    let result = "";
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        result += symbols[i];
        num -= values[i];
      }
    }
    return result;
  };

  // Function to parse member parameter: firstname_lastname_Roman Number
  const parseMemberParam = (
    memberString: string
  ): { name: string; num: string } => {
    try {
      const decoded = decodeURIComponent(memberString);

      // Split by underscore to get parts
      const parts = decoded.split("_");

      if (parts.length < 3) {
        throw new Error("Invalid member format");
      }

      // Get firstname and lastname (everything except the last part)
      const nameParts = parts.slice(0, -1);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" "); // In case lastname has spaces

      // Capitalize first letter of first name and last name
      const capitalizeFirstLetter = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };

      const capitalizedFirstName = capitalizeFirstLetter(firstName);
      const capitalizedLastName = capitalizeFirstLetter(lastName);

      // Get the number (last part) - could be Roman or Arabic
      const numberPart = parts[parts.length - 1];

      // Check if it's already an Arabic number
      const isArabicNumber = !isNaN(parseInt(numberPart));

      let arabicNumber: number;
      if (isArabicNumber) {
        // If it's already an Arabic number, use it directly
        arabicNumber = parseInt(numberPart);
      } else {
        // If it's a Roman numeral, convert to Arabic
        arabicNumber = romanToArabic(numberPart);
      }

      // Format name as "FirstName LastName"
      const fullName = `${capitalizedFirstName} ${capitalizedLastName}`;

      return {
        name: fullName,
        num: arabicNumber.toString(),
      };
    } catch (error) {
      console.error("Error parsing member parameter:", error);
      return {
        name: "Unknown Member",
        num: "N/A",
      };
    }
  };

  useEffect(() => {
    if (router.isReady) {
      if (memberParam && price) {
        const { name, num } = parseMemberParam(memberParam);
        setMember({
          name,
          num,
          price: decodeURIComponent(price),
          link: link ? decodeURIComponent(link) : undefined,
        });
      } else {
        // Set default member data if no parameters provided
        setMember({
          name: "John Doe",
          num: "1",
          price: "1000",
          link: undefined,
        });
      }
      // Initialize GSAP loader animation
      const initLogoRevealLoader = () => {
        if (typeof window === "undefined" || !window.gsap) return;

        const { gsap } = window;
        if (window.CustomEase) gsap.registerPlugin(window.CustomEase);
        if (window.SplitText) gsap.registerPlugin(window.SplitText);

        if (window.CustomEase) {
          window.CustomEase.create("loader", "0.65, 0.01, 0.05, 0.99");
        }

        const wrap = document.querySelector("[data-load-wrap]");
        if (!wrap) return;

        const container = wrap.querySelector("[data-load-container]");
        const bg = wrap.querySelector("[data-load-bg]");
        const progressBar = wrap.querySelector("[data-load-progress]");
        const logo = wrap.querySelector("[data-load-logo]");

        // Main loader timeline
        const loadTimeline = gsap
          .timeline({
            defaults: {
              ease: "loader",
              duration: 3,
            },
          })
          .set(wrap, { display: "block" })
          .to(progressBar, { scaleX: 1 })
          .to(logo, { clipPath: "inset(0% 0% 0% 0%)" }, "<")
          .to(container, { autoAlpha: 0, duration: 0.5 })
          .to(
            progressBar,
            { scaleX: 0, transformOrigin: "right center", duration: 0.5 },
            "<"
          )
          .add("hideContent", "<")
          .to(bg, { yPercent: -101, duration: 1 }, "hideContent")
          .set(wrap, { display: "none" })
          .call(() => {
            console.log("Animation complete");
          });
      };

      // Wait for GSAP to load, then initialize
      const checkGSAP = () => {
        if (window.gsap) {
          initLogoRevealLoader();
        } else {
          setTimeout(checkGSAP, 100);
        }
      };

      checkGSAP();
    }
  }, [router.isReady, memberParam, price, link]);

  return (
    <>
      <Head>
        <title>Reign - Membership Approved</title>
        <meta name="description" content="Reign is an exclusive private club in Manhattan's Lower East Side. Limited to 250 members, featuring a two floor clubhouse with concierge, library, bars, food service, lounge, courtyard, and curated member events." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta content="https://cdn.prod.website-files.com/68c78b1351743ff7b1eae907/68c8467d918d0a71b85fe984_Frame%204%20(1).png" property="og:image" />
        <link rel="icon" href="/imgs/faicon.svg" type="image/svg+xml" />
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/CustomEase.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script>
      </Head>
      <div data-load-wrap className="loader">
        <div data-load-bg className="loader__bg">
          <div data-load-progress className="loader__bg-bar"></div>
        </div>
        <div
          data-load-container
          className="loader__container"
          id="loaderContainer"
        >
          <div className="loader__logo-wrap">
            <div className="loader__logo-item is--base" id="baseLogo">
              <Image
                src="/imgs/gray_logo.svg"
                alt="REIGN NEW YORK"
                width={115}
                height={40}
                priority
                className="loader__logo-img"
              />
            </div>
            <div
              data-load-logo
              className="loader__logo-item is--top"
              id="topLogoItem"
            >
              <Image
                src="/imgs/cream_logo.svg"
                alt="REIGN NEW YORK"
                width={115}
                height={40}
                priority
                className="loader__logo-img"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-[#FAEFE0] flex flex-col items-center sm:justify-start md:justify-center sm:p-4 md:p-8 lg:p-10 text-center">
        {/* Header Logo */}
        <div className="mt-12 mb-2 sm:mt-12 sm:mb-2 md:mt-8 md:mb-8 flex justify-center items-center">
          <Image
            src="/imgs/logo.svg"
            alt="REIGN NEW YORK"
            width={115}
            height={40}
            priority
            className="w-[115px] h-auto object-contain"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>

        {/* Approval Message */}
        {/* <div className="text-[#452005] text-[18px] font-serif my-6 sm:my-6 md:my-6 font-normal px-4 w-[70vw] max-w-[320px] sm:max-w-[400px] md:max-w-[400px] lg:max-w-[400px]">
         
        </div> */}

        {/* Membership Details */}
        <div className="text-[#452005] text-[18px] font-serif my-6 sm:my-6 md:my-6 leading-relaxed w-[70vw] max-w-[320px] sm:max-w-[400px] md:max-w-[400px] lg:max-w-[400px] px-4">
          You've been been approved! <br /> Your annual member dues are $
          {member?.price ? formatPrice(member.price) : "..."}. Your member
          number is {member?.num ? arabicToRoman(parseInt(member.num)) : "..."}.
        </div>

        {/* Membership Card */}
        <div
          className="bg-[#452005] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 my-6 sm:my-6 md:my-6 relative shadow-lg w-[70vw] max-w-[320px] sm:max-w-[400px] md:max-w-[400px] lg:max-w-[400px] flex flex-col justify-between mx-4"
          style={{
            aspectRatio: "1.585 / 1",
            minHeight: "auto",
          }}
        >
          <div className="absolute top-8 left-8">
            <Image
              src="/imgs/brand.svg"
              alt="brand"
              width={50}
              height={60}
              className="w-[30px] h-[36px] sm:w-[40px] sm:h-[48px] md:w-[50px] md:h-[60px]"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </div>
          <div className="absolute bottom-8 left-8 text-[#866851] text-[16px] sm:text-[16px] md:text-[22px] font-['Palatino_Linotype','Book_Antiqua',Palatino,serif] truncate max-w-[60%]">
            {member?.name || "Loading..."}
          </div>
          <div className="absolute bottom-8 right-8 text-[#866851] text-[16px] sm:text-[16px] md:text-[22px] font-['Palatino_Linotype','Book_Antiqua',Palatino,serif] uppercase truncate max-w-[35%]">
            {member?.num ? arabicToRoman(parseInt(member.num)) : "..."}
          </div>
        </div>

        {/* Membership Details */}
        <div className="text-[#452005] text-[18px] font-serif mt-6 mb-2 sm:mt-6 sm:mb-2 md:mt-6 md:mb-2 leading-relaxed w-[70vw] max-w-[320px] sm:max-w-[400px] md:max-w-[400px] lg:max-w-[400px] px-4">
          Membership grants you access to a dedicated two floor clubhouse open{" "}
          <b>7 days a week</b> in the Lower East Side of Manhattan. The
          clubhouse will be open from 3pm until midnight on weekdays and noon
          until 2am on weekends.
        </div>

        {/* Membership Details */}
        <div className="text-[#452005] text-[18px] font-serif my-2 sm:my-2 md:my-2 leading-relaxed w-[70vw] max-w-[320px] sm:max-w-[400px] md:max-w-[400px] lg:max-w-[400px] px-4">
          The clubhouse ammenities include concierge, library, two full
          bars, food service, a lounge, courtyard and access to frequent members
          only curated events and off-sites.
        </div>

        {/* Membership Details */}
        <div className="text-[#452005] text-[18px] font-serif my-2 sm:my-2 md:my-2 leading-relaxed w-[70vw] max-w-[320px] sm:max-w-[400px] md:max-w-[400px] lg:max-w-[400px] px-4">
          Reign is limited to <b>250 members</b> total and made up of selected
          founders, writers, students, artists, and policy personnel.
        </div>

        {/* Membership Details */}
        <div className="text-[#452005] text-[18px] font-serif my-2 sm:my-2 md:my-2 leading-relaxed w-[70vw] max-w-[320px] sm:max-w-[400px] md:max-w-[400px] lg:max-w-[400px] px-4">          
          We look forward to having you as a member. Below you will find a link 
          directing you to payment for your member dues, which secures your 
          membership to Reign and your member number. 
          The typical $1,000 initiation fee has been waived.
        </div>

        {/* Membership Details */}
        <div className="text-[#452005] text-[18px] font-serif my-2 sm:my-2 md:my-2 leading-relaxed w-[70vw] max-w-[320px] sm:max-w-[400px] md:max-w-[400px] lg:max-w-[400px] px-4">
          We'll contact you to provide the opening date in the coming weeks.
        </div>

        {/* Payment Button */}
        {member?.link ? (
          <a
            href={member.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#452005] text-[#e6ceb1] border-none rounded-[0.375rem] mt-6 mb-12 px-8 py-4 text-[14px] font-semibold cursor-pointer shadow-lg transition-all duration-300 font-sans hover:bg-[#3a1a04] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-lg max-w-[280px] sm:max-w-[320px] md:max-w-none inline-block text-center no-underline"
          >
            Go to Payment
          </a>
        ) : (
          <button className="bg-[#452005] text-[#e6ceb1] border-none rounded-[0.375rem] mt-6 mb-12 px-8 py-4 text-[14px] font-semibold cursor-pointer shadow-lg transition-all duration-300 font-sans hover:bg-[#3a1a04] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-lg max-w-[280px] sm:max-w-[320px] md:max-w-none">
            Go to Payment
          </button>
        )}
      </div>
    </>
  );
}
