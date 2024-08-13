import { useState } from "react";
const ModalInfo = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0); // Add state for selected index;
  const infos = [
    {
      id: "info1",
      title: "Paula, 49, Maschinenbauingenieurin",
      body: "Paula arbeitet seit 25 Jahren in der Metallverarbeitung. Dabei war sie nicht besonders besorgt darum, dass ihr Gehör unter ihrer Arbeit leiden könnte. In ihrer Freizeit ist sie Drummerin in einer Band. Den Hörverlust bei hohen Tönen bemerkte sie lange nicht, inzwischen ist er allerdings so stark, dass sie Vögelzwitschern nicht mehr hören kann.",
      imgSrc: "media/img1.png",
    },
    {
      id: "info2",
      title: "Zehra, 31 Jahre, Juristin",
      body: "Zehra ließ während des Studiums keine Party aus. Durch den Stress während ihrer Examensvorbereitung erlitt sie einen Hörsturz, der ihr Gehör langfristig schädigte. Im Alltag trägt sie nun ein Hörgerät, das ihre Schwerhörigkeit bei mittleren Frequenzen so gut es geht ausgleicht.",
      imgSrc: "media/img2.png",
    },
    {
      id: "info3",
      title: "Marlon, 15, Schüler",
      body: "Vor einigen Jahren hatte Marlon eine Mittelohrenentzündung, bei der es zu Komplikationen kam. Seitdem hat er eine leichte Tieftonminderung. Mit Hörsystem kann diese jedoch gut ausgeglichen werden. Trotz seiner Jugend ist er sehr auf die Pflege seines Gehörs bedacht.",
      imgSrc: "media/img3.png",
    },
    {
      id: "info4",
      title: "Markus, 35 Jahre, Pflegekraft",
      body: "Markus achtet sehr auf sein Gehör und trägt auf dem Konzert seiner Lieblingsband immer einen Gehörschutz. Als er am nächsten Tag bei der Arbeit trotzdem nicht so gut hört und den Eindruck hat, seine Ohren seien verstopft, versucht er wider besseren Wissens, diese mit einem Wattestäbchen zu reinigen. Dabei bildet sich ein Propf an Ohrenschmalz, der seinen Gehörgang verschließt. Er leidet an einer akuten Schalleitungsstörung aller Tonfrequenzen.",
      imgSrc: "media/img4.png",
    },
  ];

  return (
    <div>
      <div
        className="btn-group mb-3"
        role="group"
        aria-label="Disorder buttons"
        style={{ display: "flex" }}
      >
        {infos.map((info, index) => (
          <button
            key={info.id}
            type="button"
            className={`btn ${
              index === selectedIndex ? "btn-success" : "btn-primary"
            } mr-2`}
            onClick={() => setSelectedIndex(index)}
          >
            {info.title}
          </button>
        ))}
      </div>

      {infos.map((info, index) => (
        <div
          key={info.id}
          style={{
            display: selectedIndex === index ? "block" : "none",
            padding: "1rem",
          }}
        >
          <div className="card">
            <div className="card-header" id={`heading${index}`}>
              <h5 className="mb-0">{info.title}</h5>
            </div>

            <div id={`collapse${index}`} className="collapse show">
              <div className="card-body">
                {info.body}
                <br></br>
                <div style={{ textAlign: "center" }}>
                  <img
                    style={{ maxHeight: "300px" }}
                    src={info.imgSrc}
                    alt={info.title}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModalInfo;
