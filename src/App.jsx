import styles from "./App.module.scss";
import { useState, useCallback, useMemo } from "react";

const upperline = 1;
const bottomline = 82;
const baseline = 41;

const prepareCtx = (ctx) => {
  ctx.strokeStyle = "pink";

  ctx.beginPath();
  ctx.moveTo(1, 21);
  ctx.lineTo(642, 21);
  ctx.stroke();
  ctx.moveTo(1, 41);
  ctx.lineTo(642, 41);
  ctx.stroke();
  ctx.moveTo(1, 61);
  ctx.lineTo(642, 61);
  ctx.stroke();

  for (let i = 1; i < 32; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 20, 0);
    ctx.lineTo(i * 20, 82);
    ctx.stroke();
  }

  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(1, baseline);
};

const nrz = (ctx, bits) => {
  let last_x = 1;
  let last_y = baseline;
  bits.forEach((bit) => {
    if (bit) {
      if (last_y === upperline) {
        last_x += 20;
        ctx.lineTo(last_x, upperline);
      }
      if (last_y === baseline) {
        ctx.lineTo(last_x, upperline);
        last_x += 20;
        ctx.lineTo(last_x, upperline);
        last_y = upperline;
      }
    } else {
      if (last_y === baseline) {
        last_x += 20;
        ctx.lineTo(last_x, baseline);
      }
      if (last_y === upperline) {
        ctx.lineTo(last_x, baseline);
        last_x += 20;
        ctx.lineTo(last_x, baseline);
        last_y = baseline;
      }
    }
  });
  ctx.stroke();
};

const rz = (ctx, bits) => {
  const upperline = 21;
  const bottomline = 62;
  const baseline = 41;
  let last_x = 1;
  bits.forEach((bit) => {
    if (bit) {
      ctx.lineTo(last_x, upperline);
      ctx.lineTo(last_x + 10, upperline);
      ctx.lineTo(last_x + 10, baseline);
      ctx.lineTo(last_x + 20, baseline);
    } else {
      ctx.lineTo(last_x, bottomline);
      ctx.lineTo(last_x + 10, bottomline);
      ctx.lineTo(last_x + 10, baseline);
      ctx.lineTo(last_x + 20, baseline);
    }
    last_x += 20;
  });
  ctx.stroke();
};

const munch = (ctx, bits) => {
  let last_x = 1;
  let last_y = baseline;
  bits.forEach((bit) => {
    if (bit) {
      ctx.lineTo(last_x, upperline);
      ctx.lineTo(last_x + 10, upperline);
      ctx.lineTo(last_x + 10, baseline);
      ctx.lineTo(last_x + 20, baseline);
      last_y = baseline;
    } else {
      if (last_y === baseline) {
        ctx.lineTo(last_x, baseline);
        ctx.lineTo(last_x + 10, baseline);
        ctx.lineTo(last_x + 10, upperline);
        ctx.lineTo(last_x + 20, upperline);
        last_y = upperline;
      } else {
        ctx.lineTo(last_x, baseline);
        ctx.lineTo(last_x + 10, baseline);
        ctx.lineTo(last_x + 10, upperline);
        ctx.lineTo(last_x + 20, upperline);
        last_y = baseline;
      }
    }
    last_x += 20;
  });
  ctx.stroke();
};

const ami = (ctx, bits) => {
  const upperline = 21;
  const bottomline = 62;
  const baseline = 41;
  let last_x = 1;
  let upper = true;
  bits.forEach((bit) => {
    if (bit) {
      let line;
      if (upper) {
        line = upperline;
      } else {
        line = bottomline;
      }
      ctx.lineTo(last_x, line);
      ctx.lineTo(last_x + 20, line);
      ctx.lineTo(last_x + 20, baseline);
      upper = !upper;
    } else {
      ctx.lineTo(last_x, baseline);
      ctx.lineTo(last_x + 20, baseline);
    }
    last_x += 20;
  });
  ctx.stroke();
};

const nrzi = (ctx, bits) => {
  const baseline = 41;
  let last_x = 1;
  let last_y = baseline;
  bits.forEach((bit) => {
    if (bit) {
      last_y = last_y === baseline ? upperline : baseline;
      ctx.lineTo(last_x, last_y);
      ctx.lineTo(last_x + 20, last_y);
    } else {
      ctx.lineTo(last_x + 20, last_y);
    }
    last_x += 20;
  });
  ctx.stroke();
};

function App() {
  const [value, setValue] = useState("11001110111100011110100011101111");
  const onChange = useCallback(
    (e) => {
      setValue(e.target.value);
    },
    [setValue]
  );

  const bits = useMemo(() => {
    return value.split("").map((el) => parseInt(el));
  }, [value]);

  const nrzcanvas = useCallback(
    (node) => {
      if (node) {
        const ctx = node.getContext("2d");
        ctx.clearRect(0, 0, 642, 82);
        prepareCtx(ctx);
        nrz(ctx, bits);
      }
    },
    [bits]
  );

  const rzcanvas = useCallback(
    (node) => {
      if (node) {
        const ctx = node.getContext("2d");
        ctx.clearRect(0, 0, 642, 82);
        prepareCtx(ctx);
        rz(ctx, bits);
      }
    },
    [bits]
  );

  const munchcanvas = useCallback(
    (node) => {
      if (node) {
        const ctx = node.getContext("2d");
        ctx.clearRect(0, 0, 642, 82);
        prepareCtx(ctx);
        munch(ctx, bits);
      }
    },
    [bits]
  );

  const amicanvas = useCallback(
    (node) => {
      if (node) {
        const ctx = node.getContext("2d");
        ctx.clearRect(0, 0, 642, 82);
        prepareCtx(ctx);
        ami(ctx, bits);
      }
    },
    [bits]
  );

  const nrzicanvas = useCallback(
    (node) => {
      if (node) {
        const ctx = node.getContext("2d");
        ctx.clearRect(0, 0, 642, 82);
        prepareCtx(ctx);
        nrzi(ctx, bits);
      }
    },
    [bits]
  );

  const bitline = (
    <div className={styles.bits}>
      {bits.map((bit, idx) => {
        return (
          <div key={idx} className={styles.bit}>
            {bit}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={styles.app}>
      <input
        className={styles.input}
        onChange={onChange}
        value={value}
        type="text"
      />
      <div>
        <h4>Манчестерский код</h4>
        {bitline}
        <canvas width={642} height={82} ref={munchcanvas} />
      </div>
      <div>
        <h4>Потенциальный код NRZ</h4>
        {bitline}
        <canvas width={642} height={82} ref={nrzcanvas} />
      </div>
      <div>
        <h4>Биполярный импульсный RZ</h4>
        {bitline}
        <canvas width={642} height={82} ref={rzcanvas} />
      </div>
      <div>
        <h4>Биполярный код AMI</h4>
        {bitline}
        <canvas width={642} height={82} ref={amicanvas} />
      </div>
      <div>
        <h4>Потенциальный код с инверсией при единице NRZI</h4>
        {bitline}
        <canvas width={642} height={82} ref={nrzicanvas} />
      </div>
    </div>
  );
}

export default App;
