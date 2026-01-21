function adj(m) { // Compute the adjugate of m
  return [
    m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3]
  ];
}

function multmm(a, b) { // multiply two matrices
  var c = Array(9);
  for (var i = 0; i != 3; ++i) {
    for (var j = 0; j != 3; ++j) {
      var cij = 0;
      for (var k = 0; k != 3; ++k) {
        cij += a[3 * i + k] * b[3 * k + j];
      }
      c[3 * i + j] = cij;
    }
  }
  return c;
}

function multmv(m, v) { // multiply matrix and vector
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
  ];
}

function basisToPoints(x1, y1, x2, y2, x3, y3, x4, y4) {
  var m = [
    x1, x2, x3,
    y1, y2, y3,
    1,  1,  1
  ];
  var v = multmv(adj(m), [x4, y4, 1]);
  return multmm(m, [
    v[0], 0, 0,
    0, v[1], 0,
    0, 0, v[2]
  ]);
}

function general2DProjection(
  x1s, y1s, x1d, y1d,
  x2s, y2s, x2d, y2d,
  x3s, y3s, x3d, y3d,
  x4s, y4s, x4d, y4d
) {
  var s = basisToPoints(x1s, y1s, x2s, y2s, x3s, y3s, x4s, y4s);
  var d = basisToPoints(x1d, y1d, x2d, y2d, x3d, y3d, x4d, y4d);
  return multmm(d, adj(s));
}

export function getPerspectiveTransform(src, dst) {
  // src and dst are arrays of 4 points: [[x,y], [x,y], [x,y], [x,y]]
  // Order: TL, TR, BR, BL
  
  const m = general2DProjection(
    src[0][0], src[0][1], dst[0][0], dst[0][1],
    src[1][0], src[1][1], dst[1][0], dst[1][1],
    src[2][0], src[2][1], dst[2][0], dst[2][1],
    src[3][0], src[3][1], dst[3][0], dst[3][1]
  );

  // The matrix m is a 3x3 homography matrix.
  // CSS matrix3d is 4x4 column-major.
  // Homography 3x3:
  // [m0, m1, m2]
  // [m3, m4, m5]
  // [m6, m7, m8]
  
  // CSS Matrix3d (column-major):
  // m11 m12 m13 m14
  // m21 m22 m23 m24
  // m31 m32 m33 m34
  // m41 m42 m43 m44
  
  // Mapping:
  // m11=m0, m12=m3, m13=0, m14=m6
  // m21=m1, m22=m4, m23=0, m24=m7
  // m31=0,  m32=0,  m33=1, m34=0
  // m41=m2, m42=m5, m43=0, m44=m8

  // Note: CSS transforms usually require normalization so m44 = 1, but browsers handle it.
  // However, small values of m8 can cause issues.
  
  // Normalize by m[8] is not strictly necessary for CSS if we pass all values, but convention often sets element 15 (m44 in 1-based) to 1.
  // But here, m[8] maps to w (perspective divisor), so we shouldn't normalize blindly if we want correct perspective w.
  // Wait, CSS matrix3d(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4)
  // maps to:
  // a1 a2 a3 a4
  // b1 b2 b3 b4
  // c1 c2 c3 c4
  // d1 d2 d3 d4
  
  // So:
  // a1=m0, b1=m3, c1=0, d1=m6
  // a2=m1, b2=m4, c2=0, d2=m7
  // a3=0,  b3=0,  c3=1, d3=0
  // a4=m2, b4=m5, c4=0, d4=m8

  // Normalize the matrix to avoid large numbers which might cause rendering issues
  for (let i = 0; i < 9; i++) {
    m[i] = m[i] / m[8];
  }

  return `matrix3d(
    ${m[0]}, ${m[3]}, 0, ${m[6]},
    ${m[1]}, ${m[4]}, 0, ${m[7]},
    0, 0, 1, 0,
    ${m[2]}, ${m[5]}, 0, ${m[8]}
  )`;
}
