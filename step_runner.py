"""
step_runner.py – Python step-by-step executor cho app_b17_desktop
Nhận code từ stdin, xuất JSON array kết quả ra stdout.
"""
import sys
import io
import json
import traceback


def execute_steps(code_str):
    _ns = {}
    lines = code_str.split('\n')
    results = []
    SKIP_KEYS = {'__builtins__', 'json', 'sys', 'io', 'traceback'}

    def get_vars():
        out = {}
        for k, v in _ns.items():
            if k.startswith('_') or k in SKIP_KEYS or callable(v):
                continue
            try:
                out[k] = {'value': repr(v), 'type': type(v).__name__}
            except Exception:
                pass
        return out

    for i, line in enumerate(lines):
        stripped = line.strip()
        if not stripped or stripped.startswith('#'):
            results.append({
                'lineNum': i,
                'line': line,
                'vars': get_vars(),
                'output': '',
                'error': None,
                'skip': True
            })
            continue

        line_buf = io.StringIO()
        old_stdout = sys.stdout
        sys.stdout = line_buf
        error = None

        try:
            exec(compile(stripped, '<main>', 'exec'), _ns)
        except SyntaxError:
            try:
                val = eval(stripped, _ns)
                print(repr(val))
            except Exception as e2:
                error = str(e2)
        except Exception:
            error = traceback.format_exc().rstrip().split('\n')[-1]

        output = line_buf.getvalue()
        sys.stdout = old_stdout

        results.append({
            'lineNum': i,
            'line': line,
            'vars': get_vars(),
            'output': output,
            'error': error,
            'skip': False
        })

    return results


if __name__ == '__main__':
    code = sys.stdin.read()
    result = execute_steps(code)
    # Ensure UTF-8 output on Windows
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    print(json.dumps(result, ensure_ascii=False))
