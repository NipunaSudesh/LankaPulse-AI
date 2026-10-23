"use client"
import React from 'react'
import Header from './ui/Header'
import NewsCard from './ui/NewsCard'
import { useEffect, useState } from "react";
import { fetchNews } from "@/lib/api";


// export const articles1 = [
//   {
//     id: 1,
//     title: "Sri Lanka reviews 1818 anti-drug hotline operations",
//     summary:
//       "The operations of Sri Lanka’s 1818 anti-drug hotline and its progress in helping authorities combat illegal drug activities were reviewed at a meeting held at the Presidential Secretariat in Colombo today (October 15, 2026).\n\n\nThe post Sri Lanka reviews 1818 anti-drug hotline operations appeared first on Onlanka.",
//     content:
//       "Sri Lanka reviews 1818 anti-drug hotline operations\n\nThe operations of Sri Lanka’s 1818 anti-drug hotline and its progress in helping authorities combat illegal drug activities were reviewed at a meeting held at the Presidential Secretariat in Colombo today (October 15, 2026).\n\nThe meeting was chaired by Secretary to the President Dr. Nandika Sanath Kumanayake, with the participation of senior government and security officials, including Secretary to the Ministry of Public Security and Parliamentary Affairs Ravi Seneviratne and Inspector General of Police Priyantha Weerasooriya.\n\nThe 1818 hotline was introduced under the ‘A Nation United’ national operation to combat the illegal drug menace in Sri Lanka.\n\nThe service allows people across the country to provide information about drug trafficking, distribution and other suspicious activities to security authorities at any time.\n\nThe confidentiality of those providing information is fully protected, while authorities take prompt action based on the information received.\n\nThe hotline operates from the ‘A Nation United’ Media Centre under the direct supervision of the Presidential Secretariat and the ‘A Nation United’ National Steering Committee.\n\nThe meeting also focused on the first anniversary of the ‘A Nation United’ national operation, which falls on November 5, 2026, and discussed measures to strengthen efforts to protect future generations from illegal drugs and build a safer, drug-free society.\n\nOther participants included Venerable Madovita Vajira Buddhi Thera, Director of Piriven Education at the Ministry of Education, Higher Education and Vocational Education; Prince Senadheera, Secretary to the Ministry of Buddhasasana, Religious and Cultural Affairs; and Roshan Gamage, Senior Additional Secretary to the President.\n\nSenior officials from the Department of Government Information, the Department of Buddhist Affairs, the departments responsible for Christian, Hindu and Muslim religious affairs, the tri-forces and other relevant government institutions also attended the meeting.",
//     url: "https://www.onlanka.com/news/sri-lanka-reviews-1818-anti-drug-hotline-operations.html",
//     image_url:
//       "https://www.onlanka.com/wp-content/uploads/2026/10/priyantha-weerasooriya.jpg",
//     source_name: "lk",
//     category: "politics",
//     language: "en",
//     published_at: "2026-10-15T13:34:18.000000Z",
//     created_at: "2026-10-16T04:29:02.000000Z",
//     updated_at: "2026-10-16T04:29:02.000000Z",
//   },
//   {
//     id: 2,
//     title:
//       "IMF ready to offer further support to Sri Lanka as economy improves",
//     summary:
//       "The International Monetary Fund is ready to provide further support to Sri Lanka as its economy improves, with a review that could release about $345 million awaiting board approval.\n\n\nThe post IMF ready to offer further support to Sri Lanka as economy improves appeared first on Onlanka.",
//     content:
//       "IMF ready to offer further support to Sri Lanka as economy improves\n\nThe International Monetary Fund is ready to provide further support to Sri Lanka as its economy improves, with a review that could release about $345 million awaiting board approval.\n\nSpeaking at a press conference during IMF meetings in Bangkok on Thursday (October 15), Sonali Jain-Chandra, deputy director of the IMF’s Asia and Pacific Department, said support would depend on Sri Lanka’s wishes and what was appropriate, Reuters reported.\n\nJain-Chandra said the country’s overall economic conditions had improved significantly. She highlighted strong government financial performance, a largely completed debt restructuring process and progress on structural reforms, including governance.\n\nEarlier this month, the IMF and Sri Lanka reached a staff-level agreement on the seventh review of the country’s Extended Fund Facility programme. Completion of the review would give Sri Lanka access to financing in Special Drawing Rights equivalent to about $345 million.\n\nThe IMF’s Executive Board is expected to consider the agreement in the coming weeks. Another review mission is planned before the programme ends in March, Jain-Chandra said.\n\nShe added that the IMF would remain engaged with Sri Lankan authorities beyond the agreement. Further support could include a new financing arrangement, policy advice through regular economic monitoring, or assistance to strengthen institutions and technical skills.",
//     url: "https://www.onlanka.com/news/imf-ready-to-offer-further-support-to-sri-lanka-as-economy-improves.html",
//     image_url:
//       "https://www.onlanka.com/wp-content/uploads/2026/09/imf-logo.jpg",
//     source_name: "lk",
//     category: "politics",
//     language: "en",
//     published_at: "2026-10-15T11:10:38.000000Z",
//     created_at: "2026-10-16T04:29:02.000000Z",
//     updated_at: "2026-10-16T04:29:02.000000Z",
//   },
//   {
//     id: 3,
//     title:
//       "ComBank partners Payable to introduce ‘Soundbox’ for small business digital payments",
//     summary:
//       "Driven by its commitment to introduce the latest global technologies and continuously elevate the customer experience, Commercial Bank of Ceylon has announced the introduction of ‘Soundbox,’ an innovative audio-enabled digital payment acceptance device tailored for micro, small and medium enterprises.&#160; Powered by Mastercard and implemented in partnership with Payable (Pvt) Ltd, the Soundbox solution is [&#8230;]",
//     content:
//       "Driven by its commitment to introduce the latest global technologies and continuously elevate the customer experience, Commercial Bank of Ceylon has announced the introduction of ‘Soundbox,’ an innovative audio-enabled digital payment acceptance device tailored for micro, small and medium enterprises. \n\nPowered by Mastercard and implemented in partnership with Payable (Pvt) Ltd, the Soundbox solution is designed to bring small and micro merchants, many of whom continue to rely predominantly on cash transactions, into the formal digital payments ecosystem through an affordable, simple and efficient acceptance mechanism. These devices support acceptance across all major card networks and QR schemes available in the market, marking a significant milestone in the evolution of the country’s payment landscape.\n\nSoundbox supports both contactless card payments and QR-based transactions, and provides real-time audio confirmation for every successful payment. The device announces each completed transaction, enabling merchants to verify payments instantly without interrupting their workflow. QR-based transactions will also benefit from immediate crediting, further enhancing liquidity for small businesses.\n\nCommenting on the launch, Mr Sanath Manatunge, Managing Director/CEO of Commercial Bank said: “What makes this solution compelling is its ability to remove long-standing barriers to entry for small merchants by combining affordability with immediacy. By enabling instant onboarding, real-time transaction visibility and multi-channel acceptance through a single device, we are equipping businesses with a practical tool to participate more competitively in an increasingly digital marketplace.”\n\nMr Yohan Wijesiriwardane, Co-Founder & CEO of Payable explained: “At Payable, for over a decade, we have been building towards a single goal of ensuring that no merchant is left behind in Sri Lanka’s digital economy. Soundbox brings that vision to life. A small business owner who set up shop last week should have the same access to digital payments as the largest retailer in the country, and at a price point that makes sense for where they are today. That is what this partnership with Commercial Bank and Mastercard makes possible.”\n\nMs. Mahesha Amarasuriya, Country Manager, Sri Lanka, Mastercard said: “Mastercard’s focus is on driving secure, simple, and inclusive payment experiences empowering small businesses to thrive. The introduction of Soundbox with Commercial Bank and Payable is a significant step in expanding digital acceptance for Sri Lanka. Combining affordability with innovation, the milestone supports the country’s micro and small merchant ecosystem to embrace digital payments with confidence, strengthen financial\n\ninclusion and advance Sri Lanka’s journey toward a cash-lite economy.”\n\nThe Soundbox solution is particularly suited to merchants who have found traditional point-of-sale infrastructure costly or complex. By offering a significantly lower-cost alternative that combines multiple payment methods into a single device, Soundbox eliminates the need for multiple terminals while reducing checkout friction and improving operational efficiency.\n\nThe initiative reflects Commercial Bank’s continued leadership in digital innovation and its commitment to extending the benefits of secure, convenient and inclusive financial services to underserved business segments. It also aligns with national priorities to accelerate digital adoption and reduce dependence on cash-based transactions.\n\nCustomers stand to benefit from faster, safer and more convenient payment experiences at neighbourhood businesses, while merchants gain access to reliable digital payment acceptance, reduced cash handling, enhanced transaction transparency and stronger customer trust. The introduction of Soundbox is expected to play a pivotal role in digitally empowering small businesses and deepening their integration into the formal financial system, the Bank said.\n\nCommercial Bank was the first Sri Lankan bank to achieve a market capitalisation exceeding US$ 1 billion. The Bank emerged as the No. 1 ranked Sri Lankan bank in the 2026 edition of the prestigious Top 1000 World Banks ranking published by The Banker magazine, UK. The Bank has the highest capital base among all Sri Lankan banks, and is one of the largest private sector lenders in Sri Lanka. Ranked No. 1 in the Business Today Top 40, Commercial Bank is recognised as the most respected and most-awarded bank in Sri Lanka, is a leader in digital innovation and is the country’s first 100% carbon-neutral bank.\n\nCommercial Bank operates more than 270 strategically-located branches and an extensive network of automated machines island-wide, and has the widest international footprint among Sri Lankan banks, with 21 branches in Bangladesh, a majority stake in a fully-fledged Tier I Bank in the Maldives, a microfinance company in Myanmar, and a representative office in the Dubai International Financial Centre (DIFC). The Bank’s fully-owned subsidiaries, CBC Finance PLC and Commercial Insurance Brokers (Pvt) Limited, also deliver a range of financial services via their own branch networks.",
//     url: "https://www.lankabusinessonline.com/2026/10/15/combank-partners-payable-to-introduce-soundbox-for-small-business-digital-payments",
//     image_url:
//       "https://www.lankabusinessonline.com/wp-content/uploads/2026/10/Soundbox-launch-1018x1024.jpg",
//     source_name: "lk",
//     category: "politics",
//     language: "en",
//     published_at: "2026-10-15T10:19:24.000000Z",
//     created_at: "2026-10-16T04:29:02.000000Z",
//     updated_at: "2026-10-16T04:29:02.000000Z",
//   },
//   {
//     id: 4,
//     title:
//       "From Crisis Response to Climate Resilience: Innovating for Sri Lanka’s Agrifood Future",
//     summary:
//       "Vimlendra Sharan in discussion with vegetable farmers in Nuwara Eliya district By Vimlendra Sharan, FAO Representative for Sri Lanka and the Maldives When extreme weather destroys crops, damages infrastructure and disrupts supply chains, the consequences travel far beyond the farm. They reach food prices, family nutrition, rural incomes and public finances. Cyclone Ditwah exposed this [&#8230;]",
//     content:
//       "Vimlendra Sharan in discussion with vegetable farmers in Nuwara Eliya district\n\nBy Vimlendra Sharan, FAO Representative for Sri Lanka and the Maldives\n\nWhen extreme weather destroys crops, damages infrastructure and disrupts supply chains, the consequences travel far beyond the farm. They reach food prices, family nutrition, rural incomes and public finances. Cyclone Ditwah exposed this vulnerability with painful clarity. With El Niño expected to bring further climatic pressures, Sri Lanka faces a critical choice: continue paying heavily after disasters, or invest in protecting livelihoods and production before hazards become humanitarian crises.\n\nThe economic stakes are enormous. The World Bank estimates that Cyclone Ditwah caused US$4.1 billion in direct physical damage, equivalent to about 4 percent of Sri Lanka’s GDP. Agriculture alone suffered an estimated US$814 million in damage. These are estimates of physical damage, not the full losses in income and production or the eventual cost of recovery. In a country with limited fiscal space, every preventable loss also diverts scarce resources from development to reconstruction.\n\nAs we mark World Food Day on 16 October, the theme ‘Innovate today. Nourish tomorrow.’ reminds us that safeguarding access to adequate, safe and nutritious food requires us to rethink how we produce, distribute and consume it. Innovation is not limited to new technologies. It also means changing how we anticipate climate risks, make decisions, mobilise finance and help farmers and fishers protect their livelihoods.\n\nFor Sri Lanka, the first priority is to turn early warning into early action. Credible forecasts, agreed trigger thresholds and local knowledge should guide the timely provision of short-duration seeds, fertiliser and other inputs; adjustments to planting calendars; protection of livestock and fishing assets; and practical advice on water management. A warning that reaches a farmer after the planting window has closed is of little use.\n\nThere is a compelling financial case for doing so. FAO’s global evidence shows that risk-informed early action in agriculture has generated up to US$7 in avoided losses and additional benefits for every US$1 invested. The World Meteorological Organization reports that investments in multi-hazard early warning systems yield an estimated US$9 in economic benefits per dollar invested. These are global findings, not guaranteed returns for every project, but they make one point unmistakable: preparedness is not an unaffordable extra; repeated preventable losses are.\n\nConsider the scale. An illustrative US$10 million agricultural preparedness and early-action financing window would amount to only about 1.2 percent of Ditwah’s estimated US$814 million in agricultural damage. It would not eliminate disaster losses, nor is this a proposed budget. But a prearranged facility of this kind could release support rapidly when forecasts threaten a planting season, rather than wait until smallholders need more expensive assistance to replant, replace productive assets or recover lost incomes.\n\nOther countries have shown what is possible. Bangladesh and India are examples from neighbouring countries where warnings, community networks and funds have been designed to work together. Nepal has demonstrated the financing side, arranging a US$150 million contingent disaster-financing facility before an emergency occurs.\n\nFAO is supporting the Government of Sri Lanka in putting the same principle into practice. With national institutions and technical agencies, we are supporting an integrated Flood Anticipatory Action Protocol for Batticaloa, a drought trigger for Kurunegala and a weather-linked leptospirosis trigger connecting meteorological information with public health risks. We are also working with the Departments of Meteorology and Agriculture on operational drought forecasting and institutional disaster management planning. The aim is to translate risk information into timely, coordinated decisions.\n\nSri Lanka should now institutionalise preparedness financing, rather than mobilise it afresh during each emergency. That means setting aside a predictable early-action allocation, agreeing transparent forecast-based triggers and delivery responsibilities in advance, and using rapid channels such as digital input vouchers and shock-responsive social protection. Prearranged donor financing and suitable risk-financing instruments can complement domestic resources without assuming that additional public debt is always the answer. The test of success should be measurable: hectares planted on time, crops and livelihoods protected, losses avoided and households kept out of emergency assistance.\n\nAlongside this immediate protection, resilience requires sustained investment in efficient irrigation, resilient seeds, climate-smart farming, accessible weather information and stronger agricultural extension services. Digital tools can link advice and risk data with timely support at the farm gate. In fisheries, risk-informed management and resilient landing, storage and supply chains matter just as much. Stronger systems require government, research institutions, the private sector and development partners to work towards shared priorities.\n\nInnovation also means harnessing young people’s ideas. Through the World Food Day Youth Innovation Challenge, FAO, the Ministry of Education, Higher Education and Vocational Education, and Hatton National Bank are supporting young innovators to develop practical solutions for more resilient agrifood systems. Turning promising ideas into solutions that farmers and fishers can actually use is part of preparing for tomorrow.\n\nSri Lanka cannot prevent El Niño or eliminate climate hazards. It can, however, decide whether the next warning arrives with a plan, resources and the ability to act. Preparedness will never remove the need for emergency assistance, but it can reduce the damage that makes such assistance necessary. This World Food Day, the choice is not between spending now and spending later. It is between investing early to protect harvests, livelihoods and nutrition, or paying a much higher price when they are lost.",
//     url: "https://www.lankabusinessonline.com/2026/10/15/from-crisis-response-to-climate-resilience-innovating-for-sri-lankas-agrifood-future",
//     image_url:
//       "https://www.lankabusinessonline.com/wp-content/uploads/2026/10/IMAGE-2-2-1024x683.jpg",
//     source_name: "lk",
//     category: "politics",
//     language: "en",
//     published_at: "2026-10-15T06:55:37.000000Z",
//     created_at: "2026-10-16T04:29:02.000000Z",
//     updated_at: "2026-10-16T04:29:02.000000Z",
//   },
//   {
//     id: 5,
//     title: "Two arrested with over 73 kg of cannabis in Thanamalwila",
//     summary:
//       "Two suspects were arrested with more than 73 kilograms of dried cannabis during two raids conducted by the Police Special Task Force (STF) in the Gemunupura area of Thanamalwila on Wednesday evening (October 14, 2026).\n\n\nThe post Two arrested with over 73 kg of cannabis in Thanamalwila appeared first on Onlanka.",
//     content:
//       "Two arrested with over 73 kg of cannabis in Thanamalwila\n\nTwo suspects were arrested with more than 73 kilograms of dried cannabis during two raids conducted by the Police Special Task Force (STF) in the Gemunupura area of Thanamalwila on Wednesday evening (October 14, 2026).\n\nThe raids were carried out by officers attached to the STF Kataragama Camp, based on information received.\n\nDuring the operations, officers arrested one suspect in possession of 37 kilograms and 860 grams of dried cannabis, while another suspect was arrested with 35 kilograms and 210 grams.\n\nThe two suspects, aged 39 and 56, are residents of the Kuda Oya area.\n\nBoth suspects were handed over to the Thanamalwila Police Station.\n\nThanamalwila Police are conducting further investigations.",
//     url: "https://www.onlanka.com/news/two-arrested-with-over-73-kg-of-cannabis-in-thanamalwila.html",
//     image_url:
//       "https://www.onlanka.com/wp-content/uploads/2026/09/handcuffs-police-arrest-lights.jpg",
//     source_name: "lk",
//     category: null,
//     language: "en",
//     published_at: "2026-10-15T06:31:22.000000Z",
//     created_at: "2026-10-16T04:29:02.000000Z",
//     updated_at: "2026-10-16T04:29:02.000000Z",
//   },
//   {
//     id: 6,
//     title:
//       "Hambantota International Port delivers 167,569 vehicles across 2025 and 2026 reporting periods",
//     summary:
//       "Hambantota International Port (HIP) delivered 167,569 vehicles across the March–December 2025 period and up to September 2026, with Hambantota International Port Group (HIPG) supporting vehicle importers through increased demand and disruptions affecting vehicle movements. Of this total, 86,389 vehicles were delivered between March and December 2025, comprising 30,809 brand new vehicles and 55,580 used vehicles. [&#8230;]",
//     content:
//       "Hambantota International Port (HIP) delivered 167,569 vehicles across the March–December 2025 period and up to September 2026, with Hambantota International Port Group (HIPG) supporting vehicle importers through increased demand and disruptions affecting vehicle movements.\n\nOf this total, 86,389 vehicles were delivered between March and December 2025, comprising 30,809 brand new vehicles and 55,580 used vehicles. A further 81,180 vehicles were delivered in 2026 up to September, with the reported breakdown counting 25,018 brand new vehicles and 56,162 used vehicles.\n\nThe Vehicle Importers’ Association of Lanka (VIAL) has recognised HIPG’s continued responsiveness, operational flexibility and practical support in addressing the challenges faced by its members. The partnership has focused on keeping vehicles moving efficiently through the Port while providing relief during exceptional market conditions.\n\nVIAL represents more than 450 members across Sri Lanka. Its membership includes established companies as well as micro, small and medium enterprises involved in vehicle imports and related support services. The Association works with Sri Lanka Customs, the Sri Lanka Ports Authority, the Department of Motor Traffic, the Police and other institutions on matters affecting the industry, while advocating on policy and representing members’ interests before the Government and relevant authorities.\n\nWith such a broad membership, VIAL has provided HIPG with an important channel for understanding the operational challenges faced across the vehicle-importing sector. HIPG Chief Executive Officer Wilson Qu said this dialogue had helped the Port respond more effectively as market conditions changed. “Meeting increased demand requires more than handling capacity. It requires a close understanding of our customers’ operational needs and the ability to respond when conditions change. Our work with VIAL reflects our commitment to efficient vehicle handling and to supporting the continuity of our customers’ supply chains. We value the Association’s recognition of that partnership.” \n\nHIPG responded proactively to VIAL’s operational requirements, working with the Association to identify challenges and implement timely solutions to facilitate the smooth movement of vehicles. Its support included demurrage waivers and concessions during the period of vehicle import restrictions, when customers’ vehicles remained at the Port for extended periods. These measures were provided to facilitate cargo clearance and reduce the financial impact on customers.\n\nMore recently, disruptions to vehicle transhipment through the Gulf region prompted HIPG to introduce a storage cap mechanism for affected vehicles. The mechanism helped manage storage costs and gave customers greater cost predictability during the disruption period.\n\n“We have worked closely with VIAL to understand where importers need support and to develop practical responses,” said Bindu Ranasinghe, General Manager – Commercial and Marketing, HIPG. “Whether through concessions for vehicles held during import restrictions or a storage cap during transhipment disruptions, our focus has been on helping customers manage costs and maintaining the efficient movement of their cargo. Beyond responding to immediate needs, we have worked to earn our customers’ trust and build relationships that can grow over the long term.”\n\nSampath Merenchige, President of VIAL, said, “HIPG has been responsive to the challenges faced by vehicle importers, both during the increase in demand and when unexpected disruptions have affected vehicle movements. Its willingness to work with us, provide timely operational solutions and introduce measures to help manage costs has been valuable to our members. We appreciate the Port’s continued support and flexibility.”",
//     url: "https://www.lankabusinessonline.com/2026/10/15/hambantota-international-port-delivers-167569-vehicles-across-2025-and-2026-reporting-periods",
//     image_url:
//       "https://www.lankabusinessonline.com/wp-content/uploads/2026/10/President-of-VIAL-Sampath-Merenchige-presenting-a-plaque-of-Appreciation-to-Bindu-Ranasinghe-General-Manager-Commercial-and-Marketing-at-the-VIAL-AGM-1024x929.jpeg",
//     source_name: "lk",
//     category: "politics",
//     language: "en",
//     published_at: "2026-10-15T06:26:11.000000Z",
//     created_at: "2026-10-16T04:29:02.000000Z",
//     updated_at: "2026-10-16T04:29:02.000000Z",
//   },
//   {
//     id: 7,
//     title:
//       "Nearly 120 kg of suspected heroin seized in Weligama, five arrested",
//     summary:
//       "Nearly 120 kilograms of a substance suspected to be heroin were seized, and five suspects were taken into custody during a joint operation at Kapparathota beach in Weligama.\n\n\nThe post Nearly 120 kg of suspected heroin seized in Weligama, five arrested appeared first on Onlanka.",
//     content:
//       "Nearly 120 kg of suspected heroin seized in Weligama, five arrested\n\nNearly 120 kilograms of a substance suspected to be heroin were seized, and five suspects were taken into custody during a joint operation at Kapparathota beach in Weligama.\n\nThe suspected drugs were found packed in six sacks, while a boat was also seized.\n\nThe operation was carried out by the Police Special Task Force (STF), Sri Lanka Navy, Police Narcotics Bureau and Coast Guard.\n\nOfficers also discovered two satellite phones and a Starlink system at the scene.\n\nFurther investigations are underway.",
//     url: "https://www.onlanka.com/news/nearly-120-kg-of-suspected-heroin-seized-in-weligama-five-arrested.html",
//     image_url:
//       "https://www.onlanka.com/wp-content/uploads/2025/10/drug-bust.jpg",
//     source_name: "lk",
//     category: null,
//     language: "en",
//     published_at: "2026-10-15T06:02:41.000000Z",
//     created_at: "2026-10-16T04:29:02.000000Z",
//     updated_at: "2026-10-16T04:29:02.000000Z",
//   },
// ];



export default function NewsSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchNewsData = async () => {
     try {
        const response = await fetch(
          `${API_BASE_URL}/news`
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        setArticles(result.data?.data || []);
        console.log("Fetched news articles:", result.data?.data);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Unable to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    fetchNewsData();
  }, []);

  return (
    <section
      id="News"
      aria-labelledby="News-heading"
      className="relative isolate mt-10 overflow-hidden rounded-3xl border border-border bg-surface px-4 py-4 text-text-main transition-colors duration-300 sm:px-7 sm:py-6 lg:px-10 lg:py-8"
    >
      <div className="mt-4 flex flex-col gap-6">
        <Header
          sub="Stay Informed"
          title="Explore the Latest News"
          description="Discover the latest stories across Sri Lanka and around the world, from politics and business to technology, sports, and more."
        />

        {loading && (
          <p className="py-8 text-center text-text-secondary">
            Loading latest news...
          </p>
        )}

        {error && (
          <p className="py-8 text-center text-red-500">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.length > 0 ? (
              articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))
            ) : (
              <p className="py-8 text-center text-text-secondary">
                No news articles available.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
