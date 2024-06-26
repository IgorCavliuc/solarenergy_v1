"use client";
import styles from "./styles.module.scss";
import { ScrollToBottom } from "@/app/ui";
import { useEffect, useMemo, useState } from "react";
import { Row } from "@/app/ui/Row";
import { Button } from "@/app/ui/Button";
import { Calculator } from "@/app/components";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const typeCalcValue = useMemo(
    () => [
      {
        type: "needs",
        label: "Для закрытия моих потребностей",
      },
      {
        type: "area",
        label: "Перекрыть полностью необходимую площадь",
      },
    ],
    [],
  );

  const proccessList = [
    {
      title: "Assessment and Consultation:",
      description:
        "The process begins with an assessment of your energy needs and a consultation with a solar energy expert to determine the feasibility and potential benefits of installing solar panels on your property.",
    },
    {
      title: "Site Survey:",
      description:
        "A detailed site survey is conducted to evaluate the roof structure, shading, orientation, and other factors that influence the efficiency and installation of the solar panels.",
    },
    {
      title: "System Design and Proposal:",
      description:
        "Based on the site survey, a customized system design is created, including the layout of solar panels, inverter placement, and electrical configurations. A proposal is then presented, detailing the costs, savings, and expected performance.",
    },
    {
      title: "Financing and Purchase:",
      description:
        "Once the proposal is approved, financing options are explored. This can include loans, leases, or power purchase agreements (PPAs). After securing financing, the solar panels and other necessary equipment are purchased.",
    },
    {
      title: "Permitting and Approvals:",
      description:
        "Before installation, necessary permits and approvals are obtained from local authorities and utility companies. This step ensures compliance with regulations and standards.",
    },
    {
      title: "Installation:",
      description:
        "Professional installers mount the solar panels on your roof or designated area. This involves installing mounting systems, panels, inverters, and wiring. The installation process is carried out with precision to ensure optimal performance and safety.",
    },
    {
      title: "System Inspection and Testing:",
      description:
        "After installation, the system undergoes thorough inspection and testing to ensure it meets safety standards and operates efficiently. This includes checking electrical connections, inverter functionality, and overall system performance.",
    },
    {
      title: "Grid Connection:",
      description:
        "The solar system is connected to the utility grid, allowing you to feed excess energy back to the grid and benefit from net metering. This step involves coordination with the utility company and installation of a bi-directional meter.\n",
    },
    {
      title: "Monitoring and Maintenance:",
      description:
        "Once the system is operational, it is monitored to track performance and energy production. Regular maintenance is conducted to ensure the system continues to operate efficiently. This includes cleaning panels, checking inverters, and performing any necessary repairs.",
    },
    {
      title: "Ongoing Support and Warranty:",
      description:
        "Solar panel systems typically come with warranties for equipment and performance. Ongoing support is provided by the installation company to address any issues and ensure long-term reliability and satisfaction.",
    },
  ];

  const [typeCalc, setTypeCalc] = useState({
    type: "",
    label: "",
  });
  useEffect(() => {
    setTypeCalc(typeCalcValue[0]);
  }, [typeCalcValue]);

  return (
    <div>
      <Calculator
        typeCalc={typeCalc}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setTypeCalc={setTypeCalc}
        typeCalcValue={typeCalcValue}
      />
      <div className={styles.main_container}>
        <div className={styles.main_background}></div>
        <div className={styles.main_block}>
          <p className={styles.main_title}>Energy Development Group</p>
          <p className={styles.main_descripton}>Renewable Energy Developers</p>
          <Button onClick={() => setIsModalOpen(true)}>
            Расчитать стоимость установки
          </Button>
        </div>
        <ScrollToBottom />
      </div>

      <div className={styles.calc_wrapper}>
        <div className={styles.calc_wrapper_content}>
          <h1>The process of working on a project (from start to support)</h1>

          <div className={styles.calc_wrapper_content_list}>
            {proccessList.map((item, index) => {
              return (
                <div key={index} className={styles.proccess_item}>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.info_wrapper}>
        <div className={styles.calc_wrapper_bg}></div>
        <div className={styles.info_wrapper_content}>
          <h1>
            Benefits of Using Solar Panels as an Alternative Energy Source
          </h1>

          <Row>
            <div className={styles.info_item}>
              <p className={styles.info_item_title}>Cost Savings:</p>
              <p className={styles.info_item_description}>
                Solar panels reduce your electricity bills by harnessing free,
                renewable energy from the sun, leading to significant long-term
                savings on energy costs.
              </p>
            </div>
            <div className={styles.info_item}>
              <p className={styles.info_item_title}>Environmental Benefits:</p>
              <p className={styles.info_item_description}>
                Solar energy is clean and renewable, reducing carbon emissions
                and pollution. By using solar panels, you contribute to
                protecting the environment and combating climate change.
              </p>
            </div>
          </Row>
          <Row>
            <div className={styles.info_item}>
              <p className={styles.info_item_title}>Durability:</p>
              <p className={styles.info_item_description}>
                Solar panels are built to last, with a lifespan of 25-30 years.
                This ensures a reliable and sustainable energy source for
                decades, providing long-term financial benefits.
              </p>
            </div>
            <div className={styles.info_item}>
              <p className={styles.info_item_title}>Energy Independence:</p>
              <p className={styles.info_item_description}>
                Solar panels provide energy autonomy, especially in remote
                areas. This reduces reliance on the central power grid, offering
                a reliable power source even in off-grid locations.
              </p>
            </div>
          </Row>
        </div>
      </div>
    </div>
  );
}
